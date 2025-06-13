import GLib from "gi://GLib";
import Gio from "gi://Gio";
import Soup from "gi://Soup?version=3.0";
import { Variable } from "astal";
import { launcherLogger } from "../utils/logger";
import { emojiMatchesQuery } from "../utils/emoji-search-map";

// Protobuf definitions for Signal sticker packs
const STICKERS_PROTO = {
  nested: {
    Pack: {
      fields: {
        title: { type: "string", id: 1 },
        author: { type: "string", id: 2 },
        cover: { type: "Sticker", id: 3 },
        stickers: { rule: "repeated", type: "Sticker", id: 4, options: {} }
      },
      nested: {
        Sticker: {
          fields: {
            id: { type: "uint32", id: 1 },
            emoji: { type: "string", id: 2 }
          }
        }
      }
    }
  }
};

interface StickerPackManifest {
  title: string;
  author: string;
  cover: {
    id: number;
    emoji: string;
  };
  stickers: Array<{
    id: number;
    emoji: string;
  }>;
}

interface StickerPackMetadata {
  id: string;
  key: string;
  source?: string;
  tags?: string[];
  nsfw?: boolean;
  original?: boolean;
  animated?: boolean;
  editorschoice?: boolean;
  unlisted?: boolean;
  name?: string;
}

interface StickerPack {
  manifest?: StickerPackManifest;
  meta: StickerPackMetadata;
}

interface StickerData {
  packId: string;
  packTitle: string;
  packAuthor: string;
  stickerId: number;
  emoji: string;
  imagePath: string;
  format: 'webp' | 'png' | 'apng';
}

interface CachedStickerPack {
  pack: StickerPack;
  stickers: StickerData[];
  lastAccessed: number;
}

class SignalStickersService {
  private static instance: SignalStickersService;
  private logger = launcherLogger.subClass('Sticker');
  
  private cacheDir: string;
  private cache: Map<string, CachedStickerPack> = new Map();
  private loadingPacks: Set<string> = new Set();
  private session: Soup.Session;
  
  public readonly stickerPacks = Variable<StickerPack[]>([]);
  public readonly loadedStickers = Variable<Map<string, StickerData[]>>(new Map());
  public readonly isLoading = Variable<boolean>(false);
  public readonly selectedPackId = Variable<string | null>(null);
  
  private constructor() {
    this.cacheDir = GLib.build_filenamev([GLib.get_user_cache_dir(), "ags", "stickers"]);
    this.ensureCacheDir();
    this.session = new Soup.Session();
  }
  
  static getInstance(): SignalStickersService {
    if (!SignalStickersService.instance) {
      SignalStickersService.instance = new SignalStickersService();
    }
    return SignalStickersService.instance;
  }
  
  private ensureCacheDir(): void {
    const dir = Gio.File.new_for_path(this.cacheDir);
    if (!dir.query_exists(null)) {
      dir.make_directory_with_parents(null);
    }
  }
  
  private getCachePath(packId: string, stickerId?: number): string {
    if (stickerId !== undefined) {
      return GLib.build_filenamev([this.cacheDir, packId, `${stickerId}.webp`]);
    }
    return GLib.build_filenamev([this.cacheDir, packId]);
  }
  
  private async ensurePackDir(packId: string): Promise<void> {
    const packDir = Gio.File.new_for_path(this.getCachePath(packId));
    if (!packDir.query_exists(null)) {
      packDir.make_directory_with_parents(null);
    }
  }
  
  // HKDF implementation for key derivation
  private async deriveKeys(hexKey: string): Promise<[Uint8Array, Uint8Array]> {
    // Convert hex string to bytes
    const keyData = new Uint8Array(hexKey.length / 2);
    for (let i = 0; i < hexKey.length; i += 2) {
      keyData[i / 2] = parseInt(hexKey.substr(i, 2), 16);
    }
    
    // HKDF extract and expand
    const salt = new Uint8Array(32); // Zero salt
    const info = "Sticker Pack";
    
    // Helper function to convert byte array to hex string
    const bytesToHex = (bytes: Uint8Array): string => {
      return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    };
    
    // Helper function to convert hex string to byte array
    const hexToBytes = (hex: string): Uint8Array => {
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
      }
      return bytes;
    };
    
    // Extract step: PRK = HMAC-Hash(salt, IKM)
    const prkHex = GLib.compute_hmac_for_data(
      GLib.ChecksumType.SHA256,
      salt,     // key as Uint8Array
      keyData   // data as Uint8Array
    );
    const prk = hexToBytes(prkHex);
    
    // Expand step to get 64 bytes (32 for AES key, 32 for HMAC key)
    const okmLength = 64;
    const hashLen = 32; // SHA256 output length
    const n = Math.ceil(okmLength / hashLen);
    
    let okm = new Uint8Array(0);
    let previousBlock = new Uint8Array(0);
    
    for (let i = 1; i <= n; i++) {
      // Build input for HMAC: previous || info || counter
      const infoBytes = new TextEncoder().encode(info);
      const currentBlock = new Uint8Array(previousBlock.length + infoBytes.length + 1);
      currentBlock.set(previousBlock);
      currentBlock.set(infoBytes, previousBlock.length);
      currentBlock[currentBlock.length - 1] = i;
      
      const blockHex = GLib.compute_hmac_for_data(
        GLib.ChecksumType.SHA256,
        prk,            // key as Uint8Array
        currentBlock    // data as Uint8Array
      );
      
      previousBlock = hexToBytes(blockHex);
      const newOkm = new Uint8Array(okm.length + previousBlock.length);
      newOkm.set(okm);
      newOkm.set(previousBlock, okm.length);
      okm = newOkm;
    }
    
    // Return AES key and HMAC key
    return [okm.slice(0, 32), okm.slice(32, 64)];
  }
  
  private async decryptData(hexKey: string, encryptedData: Uint8Array): Promise<Uint8Array> {
    try {
      const [aesKey, hmacKey] = await this.deriveKeys(hexKey);
      
      // Extract components
      const iv = encryptedData.slice(0, 16);
      const ciphertext = encryptedData.slice(16, encryptedData.length - 32);
      const theirMac = encryptedData.slice(encryptedData.length - 32);
      
      // Verify HMAC
      const dataToVerify = encryptedData.slice(0, encryptedData.length - 32);
      
      // GLib's compute_hmac_for_data returns hex string directly
      const computedMacHex = GLib.compute_hmac_for_data(
        GLib.ChecksumType.SHA256,
        hmacKey,        // key as Uint8Array
        dataToVerify    // data as Uint8Array
      );
      
      // Convert computed MAC from hex to bytes for comparison
      const computedMac = new Uint8Array(32);
      for (let i = 0; i < 64; i += 2) {
        computedMac[i / 2] = parseInt(computedMacHex.substr(i, 2), 16);
      }
      
      // Compare MACs
      let macValid = true;
      for (let i = 0; i < 32; i++) {
        if (computedMac[i] !== theirMac[i]) {
          macValid = false;
          break;
        }
      }
      
      if (!macValid) {
        // Log MAC mismatch for debugging
        this.logger.debug("MAC verification details", {
          theirMacHex: Array.from(theirMac).map(b => b.toString(16).padStart(2, '0')).join(''),
          computedMacHex: computedMacHex,
          dataToVerifyLength: dataToVerify.length
        });
        throw new Error("MAC verification failed");
      }
      
      // Decrypt using OpenSSL via system command
      return await this.decryptWithOpenSSL(aesKey, iv, ciphertext);
      
    } catch (error) {
      this.logger.error("Decryption failed", { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        hexKeyLength: hexKey.length,
        encryptedDataLength: encryptedData.length
      });
      throw error;
    }
  }
  
  private async decryptWithOpenSSL(aesKey: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      try {
        // Create temporary files for the encrypted data
        const tempDir = GLib.get_tmp_dir();
        const timestamp = Date.now();
        const encryptedFile = GLib.build_filenamev([tempDir, `sticker_enc_${timestamp}.bin`]);
        const decryptedFile = GLib.build_filenamev([tempDir, `sticker_dec_${timestamp}.bin`]);
        const keyFile = GLib.build_filenamev([tempDir, `sticker_key_${timestamp}.bin`]);
        const ivFile = GLib.build_filenamev([tempDir, `sticker_iv_${timestamp}.bin`]);
        
        // Write files
        const encFile = Gio.File.new_for_path(encryptedFile);
        const kFile = Gio.File.new_for_path(keyFile);
        const iFile = Gio.File.new_for_path(ivFile);
        
        encFile.replace_contents(ciphertext, null, false, Gio.FileCreateFlags.PRIVATE, null);
        kFile.replace_contents(aesKey, null, false, Gio.FileCreateFlags.PRIVATE, null);
        iFile.replace_contents(iv, null, false, Gio.FileCreateFlags.PRIVATE, null);
        
        // Convert key and IV to hex for OpenSSL
        const keyHex = Array.from(aesKey).map(b => b.toString(16).padStart(2, '0')).join('');
        const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
        
        this.logger.debug("Decrypting with OpenSSL", {
          ciphertextSize: ciphertext.length,
          keyLength: keyHex.length,
          ivLength: ivHex.length
        });
        
        // Run OpenSSL command
        const command = [
          'openssl', 'enc', '-d',
          '-aes-256-cbc',
          '-K', keyHex,
          '-iv', ivHex,
          '-in', encryptedFile,
          '-out', decryptedFile
        ];
        
        const proc = new Gio.Subprocess({
          argv: command,
          flags: Gio.SubprocessFlags.STDERR_PIPE
        });
        
        proc.init(null);
        
        proc.wait_async(null, (source, result) => {
          try {
            const success = proc.wait_finish(result);
            
            if (!success || proc.get_exit_status() !== 0) {
              // Read stderr for error message
              const [, stderr] = proc.communicate_utf8(null, null);
              reject(new Error(`OpenSSL decryption failed: ${stderr}`));
              return;
            }
            
            // Read decrypted data
            const decFile = Gio.File.new_for_path(decryptedFile);
            const [readSuccess, decryptedData] = decFile.load_contents(null);
            
            if (!readSuccess) {
              reject(new Error("Failed to read decrypted data"));
              return;
            }
            
            // Clean up temporary files
            encFile.delete(null);
            kFile.delete(null);
            iFile.delete(null);
            decFile.delete(null);
            
            this.logger.debug("OpenSSL decryption successful", {
              decryptedSize: decryptedData.length
            });
            
            resolve(decryptedData);
            
          } catch (error) {
            // Clean up on error
            try {
              encFile.delete(null);
              kFile.delete(null);
              iFile.delete(null);
              Gio.File.new_for_path(decryptedFile).delete(null);
            } catch (e) {
              // Ignore cleanup errors
            }
            
            reject(error);
          }
        });
        
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Simple protobuf parser for sticker manifest
  private parseManifest(data: Uint8Array): StickerPackManifest {
    // This is a simplified protobuf parser
    // In production, you'd want a proper protobuf library
    const manifest: StickerPackManifest = {
      title: "",
      author: "",
      cover: { id: 0, emoji: "" },
      stickers: []
    };
    
    let offset = 0;
    while (offset < data.length) {
      const tag = data[offset] >> 3;
      const wireType = data[offset] & 0x7;
      offset++;
      
      if (tag === 1 && wireType === 2) { // title
        const len = data[offset];
        offset++;
        manifest.title = new TextDecoder().decode(data.slice(offset, offset + len));
        offset += len;
      } else if (tag === 2 && wireType === 2) { // author
        const len = data[offset];
        offset++;
        manifest.author = new TextDecoder().decode(data.slice(offset, offset + len));
        offset += len;
      } else if (tag === 4 && wireType === 2) { // sticker
        const len = data[offset];
        offset++;
        const stickerEnd = offset + len;
        
        let stickerId = 0;
        let emoji = "";
        
        while (offset < stickerEnd) {
          const stickerTag = data[offset] >> 3;
          const stickerWireType = data[offset] & 0x7;
          offset++;
          
          if (stickerTag === 1 && stickerWireType === 0) { // id
            stickerId = data[offset];
            offset++;
          } else if (stickerTag === 2 && stickerWireType === 2) { // emoji
            const emojiLen = data[offset];
            offset++;
            emoji = new TextDecoder().decode(data.slice(offset, offset + emojiLen));
            offset += emojiLen;
          }
        }
        
        manifest.stickers.push({ id: stickerId, emoji });
      } else {
        // Skip unknown fields
        if (wireType === 0) offset++;
        else if (wireType === 2) {
          const len = data[offset];
          offset += 1 + len;
        }
      }
    }
    
    // Set cover from first sticker if not set
    if (manifest.stickers.length > 0 && !manifest.cover.emoji) {
      manifest.cover = manifest.stickers[0];
    }
    
    return manifest;
  }
  
  private async fetchUrl(url: string): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const message = Soup.Message.new("GET", url);
      
      this.session.send_and_read_async(message, GLib.PRIORITY_DEFAULT, null, (_, result) => {
        try {
          const bytes = this.session.send_and_read_finish(result);
          
          // Check HTTP status
          const status = message.get_status();
          this.logger.debug("HTTP response", { url, status });
          
          if (status !== 200) {
            reject(new Error(`HTTP ${status} response`));
            return;
          }
          
          if (!bytes) {
            reject(new Error("No data received"));
            return;
          }
          
          const data = bytes.get_data();
          if (!data) {
            reject(new Error("Failed to get data from response"));
            return;
          }
          
          this.logger.debug("Fetched data", { 
            url, 
            dataLength: data.length 
          });
          
          resolve(data);
        } catch (error) {
          this.logger.error("fetchUrl failed", {
            url,
            error: error instanceof Error ? error.message : String(error)
          });
          reject(error);
        }
      });
    });
  }
  
  async loadStickerPacks(packConfigs: Array<{id: string, key: string, name?: string}>): Promise<void> {
    this.logger.info(`Loading ${packConfigs.length} sticker packs`);
    this.isLoading.set(true);
    const packs: StickerPack[] = [];
    
    for (const config of packConfigs) {
      try {
        // Check if pack is already loaded
        const cached = this.cache.get(config.id);
        if (cached) {
          this.logger.debug(`Using cached pack: ${config.id}`);
          // Ensure the cached pack has the correct key from config
          cached.pack.meta.key = config.key;
          cached.pack.meta.name = config.name || cached.pack.meta.name;
          packs.push(cached.pack);
          cached.lastAccessed = Date.now();
          continue;
        }
        
        // Create pack metadata from config
        const pack: StickerPack = {
          meta: {
            id: config.id,
            key: config.key,
            name: config.name,
            unlisted: false
          }
        };
        
        // Try to load manifest from cache
        await this.ensurePackDir(config.id);
        const manifestPath = GLib.build_filenamev([this.getCachePath(config.id), "manifest.json"]);
        const manifestFile = Gio.File.new_for_path(manifestPath);
        
        if (manifestFile.query_exists(null)) {
          try {
            const [success, contents] = manifestFile.load_contents(null);
            if (success) {
              const decoder = new TextDecoder();
              const manifestData = JSON.parse(decoder.decode(contents));
              pack.manifest = manifestData;
            }
          } catch (e) {
            this.logger.error(`Failed to load cached manifest for ${config.id}`, { error: e });
          }
        }
        
        packs.push(pack);
        
        // Initialize cache entry
        this.cache.set(config.id, {
          pack,
          stickers: [],
          lastAccessed: Date.now()
        });
        
      } catch (error) {
        this.logger.error(`Failed to load sticker pack ${config.id}`, { error });
      }
    }
    
    this.stickerPacks.set(packs);
    this.isLoading.set(false);
  }
  
  async loadStickerPackDetails(packId: string, key: string): Promise<void> {
    this.logger.info(`Loading sticker pack details for ${packId}`);
    
    if (this.loadingPacks.has(packId)) {
      this.logger.debug(`Pack ${packId} is already loading`);
      return;
    }
    
    // Check if we already have loaded stickers for this pack
    const currentStickers = this.loadedStickers.get();
    if (currentStickers.has(packId)) {
      this.logger.info(`Pack ${packId} already loaded with ${currentStickers.get(packId)?.length || 0} stickers (cache hit)`);
      return;
    }
    
    this.loadingPacks.add(packId);
    
    try {
      await this.ensurePackDir(packId);
      
      // Check for cached manifest first
      const manifestPath = GLib.build_filenamev([this.getCachePath(packId), "manifest.json"]);
      const manifestFile = Gio.File.new_for_path(manifestPath);
      let manifest: StickerPackManifest | null = null;
      
      if (manifestFile.query_exists(null)) {
        try {
          const [success, contents] = manifestFile.load_contents(null);
          if (success) {
            const decoder = new TextDecoder();
            manifest = JSON.parse(decoder.decode(contents));
            this.logger.info(`Loaded manifest from cache for pack ${packId} (cache hit)`);
            
            // Update pack with cached manifest
            const cached = this.cache.get(packId);
            if (cached) {
              cached.pack.manifest = manifest;
            }
          }
        } catch (e) {
          this.logger.error(`Failed to load cached manifest for ${packId}`, { error: e });
          manifest = null;
        }
      }
      
      // If no cached manifest, try to fetch from Signal CDN
      if (!manifest) {
        const manifestUrl = `https://cdn-ca.signal.org/stickers/${packId}/manifest.proto`;
        this.logger.debug(`No cached manifest found, fetching from ${manifestUrl}`);
        
        try {
          const encryptedManifest = await this.fetchUrl(manifestUrl);
          const decryptedManifest = await this.decryptData(key, encryptedManifest);
          
          if (decryptedManifest.length > 0) {
            manifest = this.parseManifest(decryptedManifest);
            this.logger.info(`Downloaded and parsed manifest for pack ${packId} (cache miss)`);
            
            // Save manifest
            const encoder = new TextEncoder();
            manifestFile.replace_contents(
              encoder.encode(JSON.stringify(manifest, null, 2)),
              null,
              false,
              Gio.FileCreateFlags.REPLACE_DESTINATION,
              null
            );
            
            // Update pack with manifest
            const cached = this.cache.get(packId);
            if (cached) {
              cached.pack.manifest = manifest;
            }
          }
        } catch (fetchError) {
          this.logger.warn(`Failed to fetch manifest from CDN`, { 
            error: fetchError instanceof Error ? fetchError.message : String(fetchError),
            packId,
            manifestUrl
          });
          
          // Still no manifest, use placeholder
          manifest = {
            title: this.cache.get(packId)?.pack.meta.name || "Sticker Pack",
            author: "Unknown",
            cover: { id: 0, emoji: "📦" },
            stickers: [
              { id: 1, emoji: "😀" },
              { id: 2, emoji: "😎" },
              { id: 3, emoji: "🤔" },
              { id: 4, emoji: "❤️" },
              { id: 5, emoji: "👍" },
              { id: 6, emoji: "🎉" },
              { id: 7, emoji: "🔥" },
              { id: 8, emoji: "✨" },
            ]
          };
          
          // Save placeholder manifest
          const encoder = new TextEncoder();
          manifestFile.replace_contents(
            encoder.encode(JSON.stringify(manifest, null, 2)),
            null,
            false,
            Gio.FileCreateFlags.REPLACE_DESTINATION,
            null
          );
          
          this.logger.info(`Created placeholder manifest for pack ${packId}`);
        }
      }
      
      // At this point we have a manifest (cached, downloaded, or placeholder)
      if (manifest) {
        // Update pack with manifest
        const cached = this.cache.get(packId);
        if (cached) {
          cached.pack.manifest = manifest;
          
          // Update the stickerPacks Variable to reflect the new manifest
          const currentPacks = this.stickerPacks.get();
          const updatedPacks = currentPacks.map(p => 
            p.meta.id === packId ? cached.pack : p
          );
          this.stickerPacks.set(updatedPacks);
        }
        
        // Process stickers (download if needed)
        await this.downloadStickers(packId, key, manifest);
      }
      
    } catch (error) {
      this.logger.error(`Failed to load sticker pack details for ${packId}`, { error });
    } finally {
      this.loadingPacks.delete(packId);
    }
  }
  
  private async downloadStickers(packId: string, key: string, manifest: StickerPackManifest): Promise<void> {
    const stickers: StickerData[] = [];
    let downloadedCount = 0;
    let cachedCount = 0;
    
    for (const sticker of manifest.stickers) {
      try {
        const stickerPath = this.getCachePath(packId, sticker.id);
        const stickerFile = Gio.File.new_for_path(stickerPath);
        
        // Skip if already exists
        if (!stickerFile.query_exists(null)) {
          const stickerUrl = `https://cdn-ca.signal.org/stickers/${packId}/full/${sticker.id}`;
          this.logger.debug(`Downloading sticker ${sticker.id} from ${stickerUrl} (cache miss)`);
          
          try {
            const encryptedSticker = await this.fetchUrl(stickerUrl);
            const decryptedSticker = await this.decryptData(key, encryptedSticker);
            
            if (decryptedSticker.length > 0) {
              // Save sticker
              stickerFile.replace_contents(
                decryptedSticker,
                null,
                false,
                Gio.FileCreateFlags.REPLACE_DESTINATION,
                null
              );
              downloadedCount++;
              this.logger.debug(`Successfully downloaded sticker ${sticker.id} for pack ${packId}`);
            }
          } catch (downloadError) {
            this.logger.warn(`Failed to download sticker ${sticker.id}`, { error: downloadError });
          }
        } else {
          cachedCount++;
          this.logger.debug(`Sticker ${sticker.id} already cached for pack ${packId} (cache hit)`);
        }
        
        stickers.push({
          packId,
          packTitle: manifest.title,
          packAuthor: manifest.author,
          stickerId: sticker.id,
          emoji: sticker.emoji,
          imagePath: stickerPath,
          format: 'webp'
        });
        
      } catch (error) {
        this.logger.error(`Failed to process sticker ${sticker.id}`, { error });
      }
    }
    
    // Update cache
    const cached = this.cache.get(packId);
    if (cached) {
      cached.stickers = stickers;
      cached.lastAccessed = Date.now();
    }
    
    // Update loaded stickers
    const currentStickers = new Map(this.loadedStickers.get());
    currentStickers.set(packId, stickers);
    this.loadedStickers.set(currentStickers);
    
    this.logger.info(`Successfully loaded ${stickers.length} stickers for pack ${packId}`, {
      downloadedCount,
      cachedCount,
      totalStickers: stickers.length
    });
  }
  
  searchStickers(query: string): StickerData[] {
    const results: StickerData[] = [];
    const searchLower = query.toLowerCase();
    
    // Use loadedStickers Variable for reactive updates
    const loadedStickersMap = this.loadedStickers.get();
    
    for (const [packId, stickers] of loadedStickersMap) {
      for (const sticker of stickers) {
        // Check if emoji directly contains the search term
        const directMatch = sticker.emoji.includes(searchLower) ||
          sticker.packTitle.toLowerCase().includes(searchLower) ||
          sticker.packAuthor.toLowerCase().includes(searchLower);
        
        // Check if emoji matches based on keyword mapping
        const keywordMatch = emojiMatchesQuery(sticker.emoji, searchLower);
        
        if (directMatch || keywordMatch) {
          results.push(sticker);
        }
      }
    }
    
    this.logger.debug("Search results", {
      query,
      resultCount: results.length,
      searchLower,
      totalPacks: loadedStickersMap.size
    });
    
    return results;
  }
  
  selectPack(packId: string | null): void {
    this.selectedPackId.set(packId);
  }
  
  getPackStickers(packId: string): StickerData[] {
    // First check the loadedStickers Variable (reactive)
    const loadedStickersMap = this.loadedStickers.get();
    if (loadedStickersMap.has(packId)) {
      return loadedStickersMap.get(packId) || [];
    }
    
    // Fallback to cache
    const cached = this.cache.get(packId);
    return cached?.stickers || [];
  }
  
  getAllStickers(): StickerData[] {
    const allStickers: StickerData[] = [];
    const loadedStickersMap = this.loadedStickers.get();
    
    for (const [_, stickers] of loadedStickersMap) {
      allStickers.push(...stickers);
    }
    
    return allStickers;
  }
  
  clearCache(): void {
    this.cache.clear();
    this.stickerPacks.set([]);
    this.loadedStickers.set(new Map());
  }
  
  refreshPackInCache(packId: string): void {
    // Force a refresh of the stickerPacks Variable to ensure UI updates
    const currentPacks = this.stickerPacks.get();
    this.stickerPacks.set([...currentPacks]);
  }
  
  async previewStickerPackFromUrl(url: string): Promise<{ 
    id: string; 
    key: string; 
    manifest: StickerPackManifest;
    exists: boolean;
  } | null> {
    try {
      // Parse Signal sticker URL
      const urlMatch = url.match(/pack_id=([a-f0-9]+)&pack_key=([a-f0-9]+)/i);
      if (!urlMatch) {
        this.logger.error("Invalid Signal sticker URL format", { url });
        return null;
      }
      
      const packId = urlMatch[1];
      const key = urlMatch[2];
      
      this.logger.info(`Previewing sticker pack from URL`, { packId, key });
      
      // Check if pack already exists in config
      const packs = this.stickerPacks.get();
      const exists = packs.some(p => p.meta.id === packId);
      
      try {
        // Fetch manifest without downloading stickers
        const manifestUrl = `https://cdn-ca.signal.org/stickers/${packId}/manifest.proto`;
        const encryptedManifest = await this.fetchUrl(manifestUrl);
        const decryptedManifest = await this.decryptData(key, encryptedManifest);
        
        if (decryptedManifest.length > 0) {
          const manifest = this.parseManifest(decryptedManifest);
          
          return {
            id: packId,
            key: key,
            manifest: manifest,
            exists: exists
          };
        }
      } catch (error) {
        this.logger.error("Failed to fetch manifest for preview", { 
          packId,
          error: error instanceof Error ? error.message : String(error) 
        });
      }
      
      return null;
      
    } catch (error) {
      this.logger.error("Failed to preview sticker pack from URL", { 
        url, 
        error: error instanceof Error ? error.message : String(error) 
      });
      return null;
    }
  }

  async addStickerPackFromUrl(url: string): Promise<{ id: string; key: string; name: string } | null> {
    try {
      // Parse Signal sticker URL
      // Example: https://signal.art/addstickers/#pack_id=7a1a0e746556ff3decadf23a5833d5a6&pack_key=f89beb20b170994756eac11822de5d961ce096567cb3e3f7b81922982ba8ea78
      const urlMatch = url.match(/pack_id=([a-f0-9]+)&pack_key=([a-f0-9]+)/i);
      if (!urlMatch) {
        this.logger.error("Invalid Signal sticker URL format", { url });
        return null;
      }
      
      const packId = urlMatch[1];
      const key = urlMatch[2];
      
      this.logger.info(`Adding sticker pack from URL`, { packId, key });
      
      // Check if pack is already loaded, if so clear it from cache to force reload
      if (this.loadedStickers.get().has(packId)) {
        this.logger.info(`Pack ${packId} already loaded, clearing from cache to reload`);
        const currentStickers = new Map(this.loadedStickers.get());
        currentStickers.delete(packId);
        this.loadedStickers.set(currentStickers);
        this.cache.delete(packId);
      }
      
      // Load pack details to get the title
      await this.loadStickerPackDetails(packId, key);
      
      // Get the pack from cache
      const cached = this.cache.get(packId);
      if (!cached || !cached.pack.manifest) {
        this.logger.error("Failed to load pack manifest", { 
          packId,
          hasCached: !!cached,
          hasManifest: !!cached?.pack?.manifest
        });
        
        // Try to read manifest from file
        const manifestPath = GLib.build_filenamev([this.getCachePath(packId), "manifest.json"]);
        const manifestFile = Gio.File.new_for_path(manifestPath);
        
        if (manifestFile.query_exists(null)) {
          try {
            const [success, contents] = manifestFile.load_contents(null);
            if (success) {
              const decoder = new TextDecoder();
              const manifest = JSON.parse(decoder.decode(contents));
              
              const packInfo = {
                id: packId,
                key: key,
                name: manifest.title || "Unknown Pack"
              };
              
              this.logger.info("Loaded pack info from file", packInfo);
              return packInfo;
            }
          } catch (e) {
            this.logger.error("Failed to read manifest from file", { error: e });
          }
        }
        
        return null;
      }
      
      const packInfo = {
        id: packId,
        key: key,
        name: cached.pack.manifest.title
      };
      
      this.logger.info("Successfully loaded pack info", packInfo);
      return packInfo;
      
    } catch (error) {
      this.logger.error("Failed to add sticker pack from URL", { 
        url, 
        error: error instanceof Error ? error.message : String(error) 
      });
      return null;
    }
  }
}

export default SignalStickersService.getInstance();
export type { StickerData, StickerPack, StickerPackManifest, StickerPackMetadata };