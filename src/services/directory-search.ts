import { execAsync } from "astal";
import { fileExists } from "../utils";
import configManager from "./config-manager";
import { serviceLogger as log } from "../utils/logger";
import GLib from "gi://GLib";

interface SearchOptions {
  maxResults?: number;
  searchHidden?: boolean;
  followSymlinks?: boolean;
  maxDepth?: number;
  excludePaths?: string[];
}

interface FileInfo {
  path: string;
  name: string;
  isDirectory: boolean;
  score?: number;
}

class DirectorySearchService {
  private cache: Map<string, FileInfo[]> = new Map();
  private cacheTimeout: number | null = null;
  private readonly CACHE_DURATION = 30000; // 30 seconds
  
  constructor() {
    log.info("DirectorySearchService initialized");
  }

  /**
   * Fuzzy match scoring algorithm inspired by FZF
   * Returns a score - higher is better match
   */
  private fuzzyScore(query: string, target: string): number {
    const queryLower = query.toLowerCase();
    const targetLower = target.toLowerCase();
    
    // Exact match
    if (targetLower === queryLower) return 1000;
    
    // Starts with query
    if (targetLower.startsWith(queryLower)) return 900;
    
    // Contains exact query
    if (targetLower.includes(queryLower)) return 800;
    
    // Character-by-character fuzzy match
    let score = 0;
    let queryIndex = 0;
    let previousMatchIndex = -1;
    let consecutiveMatches = 0;
    
    for (let i = 0; i < target.length && queryIndex < query.length; i++) {
      if (targetLower[i] === queryLower[queryIndex]) {
        // Base score for match
        score += 10;
        
        // Bonus for consecutive matches
        if (previousMatchIndex === i - 1) {
          consecutiveMatches++;
          score += consecutiveMatches * 5;
        } else {
          consecutiveMatches = 1;
        }
        
        // Bonus for match at word boundary
        if (i === 0 || !target[i - 1].match(/\w/)) {
          score += 15;
        }
        
        // Bonus for capital letter match
        if (target[i] === target[i].toUpperCase() && target[i].match(/[A-Z]/)) {
          score += 10;
        }
        
        previousMatchIndex = i;
        queryIndex++;
      }
    }
    
    // Only return score if all query characters were found
    if (queryIndex === query.length) {
      // Penalty for longer strings
      score -= (target.length - query.length) * 0.5;
      return Math.max(0, score);
    }
    
    return 0;
  }

  /**
   * Check if a command exists
   */
  private async commandExists(command: string): Promise<boolean> {
    try {
      await execAsync(["which", command]);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Execute command with timeout
   */
  private async execWithTimeout(cmd: string[], timeoutMs: number = 5000): Promise<string> {
    return new Promise((resolve, reject) => {
      let timeoutId: number | null = null;
      let resolved = false;
      
      // Set timeout
      timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, timeoutMs, () => {
        if (!resolved) {
          resolved = true;
          reject(new Error(`Command timed out after ${timeoutMs}ms`));
        }
        return GLib.SOURCE_REMOVE;
      });
      
      // Execute command
      execAsync(cmd)
        .then(result => {
          if (!resolved) {
            resolved = true;
            if (timeoutId) GLib.Source.remove(timeoutId);
            resolve(result);
          }
        })
        .catch(error => {
          if (!resolved) {
            resolved = true;
            if (timeoutId) GLib.Source.remove(timeoutId);
            reject(error);
          }
        });
    });
  }

  /**
   * Search directories and files with fuzzy matching
   */
  async search(query: string, options: SearchOptions = {}): Promise<FileInfo[]> {
    const {
      maxResults = 20,
      searchHidden = false,
      followSymlinks = false,
      maxDepth = 2, // Reduced default depth
      excludePaths = [".git", "node_modules", ".cache", "dist", "build"]
    } = options;

    if (!query || query.length < 1) {
      return [];
    }
    
    // TEST MODE - Remove this after debugging
    if (query === "test") {
      log.info("Directory search TEST MODE activated");
      return [
        { path: "/home/test/file1.txt", name: "file1.txt", isDirectory: false, score: 100 },
        { path: "/home/test/dir1", name: "dir1", isDirectory: true, score: 90 },
        { path: "/home/test/file2.md", name: "file2.md", isDirectory: false, score: 80 },
      ];
    }

    try {
      const homeDir = GLib.get_home_dir();
      
      // Check for fd first
      const hasFd = await this.commandExists("fd");
      
      // Search paths - more paths when using fd since it's faster
      let searchPaths = [];
      
      if (hasFd) {
        // fd is fast, we can search more locations
        searchPaths = [
          homeDir,
          `${homeDir}/Documents`,
          `${homeDir}/Downloads`,
          `${homeDir}/Pictures`,
          `${homeDir}/Videos`,
          `${homeDir}/Music`,
          `${homeDir}/Desktop`,
          `${homeDir}/Projects`,
          `${homeDir}/.config`,
        ];
      } else {
        // Limited paths for find command
        searchPaths = [
          `${homeDir}/Documents`,
          `${homeDir}/Downloads`,
          `${homeDir}/.config/ags`,
        ];
      }
      
      searchPaths = searchPaths.filter(path => fileExists(path));
      
      if (searchPaths.length === 0) {
        log.warn("No search paths found");
        return [];
      }
      
      log.debug("Search paths", { paths: searchPaths });

      let results: FileInfo[] = [];
      
      if (hasFd) {
        log.debug("Using fd for directory search");
        results = await this.searchWithFd(query, searchPaths, options);
      } else {
        log.debug("Using find for directory search (fd not found)");
        results = await this.searchWithSimpleFind(query, searchPaths, options);
      }
      
      log.debug("Raw search results", { count: results.length });

      // Apply fuzzy matching and scoring
      const scored = results
        .map(result => ({
          ...result,
          score: Math.max(
            this.fuzzyScore(query, result.name),
            this.fuzzyScore(query, result.path) * 0.7 // Lower weight for path matches
          )
        }))
        .filter(result => result.score > 0)
        .sort((a, b) => {
          // Sort by score (descending), then directories first, then name
          if (b.score !== a.score) return b.score - a.score;
          if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
          return a.name.localeCompare(b.name);
        })
        .slice(0, maxResults);

      log.debug("Directory search completed", { 
        query, 
        totalResults: results.length,
        scoredResults: scored.length 
      });

      return scored;
    } catch (error) {
      log.error("Directory search failed", { error });
      return [];
    }
  }

  /**
   * Simple find with timeout and limited scope
   */
  private async searchWithSimpleFind(query: string, paths: string[], options: SearchOptions): Promise<FileInfo[]> {
    const { maxDepth = 2 } = options;
    const results: FileInfo[] = [];
    
    // Process one path at a time with timeout
    for (const searchPath of paths) {
      try {
        // Very simple find - just list files, no complex filters
        const cmd = ["find", searchPath, "-maxdepth", maxDepth.toString()];
        
        log.debug("Running find command", { path: searchPath });
        
        // Use timeout to prevent hanging
        const output = await this.execWithTimeout(cmd, 2000); // 2 second timeout per path
        
        const lines = output.trim().split('\n').filter(line => line.length > 0 && line !== searchPath);
        
        // Limit results per path to prevent overwhelming
        const limitedLines = lines.slice(0, 100);
        
        for (const path of limitedLines) {
          const name = path.split('/').pop() || '';
          
          // Skip hidden files if not searching for them
          if (!options.searchHidden && name.startsWith('.')) continue;
          
          // Skip excluded paths
          if (options.excludePaths?.some(exclude => path.includes(`/${exclude}/`))) continue;
          
          // Simple heuristic - if no extension, probably a directory
          const lastPart = name;
          const isDirectory = !lastPart.includes('.') || lastPart === '.' || lastPart === '..';
          
          results.push({ path, name, isDirectory });
          
          // Stop if we have enough results
          if (results.length >= 50) break;
        }
      } catch (error) {
        log.debug("find failed or timed out for path", { path: searchPath, error });
        // Continue with next path
      }
      
      // Stop if we have enough results
      if (results.length >= 50) break;
    }
    
    return results;
  }

  /**
   * Search using fd - fast and user-friendly find alternative
   */
  private async searchWithFd(query: string, paths: string[], options: SearchOptions): Promise<FileInfo[]> {
    const { searchHidden = false, maxDepth = 3, excludePaths = [] } = options;
    const results: FileInfo[] = [];
    
    try {
      // Build fd command
      const cmd = ["fd"];
      
      // Search pattern - use regex for fuzzy matching
      // Convert query to a pattern where each character can have anything between
      const pattern = query.split('').join('.*');
      cmd.push("--regex", pattern);
      
      // Options
      cmd.push("--type", "f");     // Files
      cmd.push("--type", "d");     // Directories
      cmd.push("--max-depth", maxDepth.toString());
      
      if (searchHidden) {
        cmd.push("--hidden");
      }
      
      // Exclude patterns
      for (const exclude of excludePaths) {
        cmd.push("--exclude", exclude);
      }
      
      // Add paths
      cmd.push(...paths);
      
      log.debug("Running fd command", { cmd: cmd.join(" ") });
      
      // Run with timeout
      const output = await this.execWithTimeout(cmd, 3000); // 3 second timeout
      
      const lines = output.trim().split('\n').filter(line => line.length > 0);
      
      // Limit total results
      const limitedLines = lines.slice(0, 200);
      
      for (const path of limitedLines) {
        const name = path.split('/').pop() || '';
        
        // Determine if directory based on fd output
        // fd includes trailing slash for directories when using --type d
        // But since we're using both -t f and -t d, we need to check
        let isDirectory = false;
        
        // Simple heuristic - files usually have extensions
        if (!name.includes('.') || name.endsWith('.d') || name.endsWith('.config')) {
          // Could be a directory, but fd doesn't tell us directly with these flags
          // Use a quick check
          try {
            await this.execWithTimeout(["test", "-d", path], 100);
            isDirectory = true;
          } catch {
            isDirectory = false;
          }
        }
        
        results.push({ path, name, isDirectory });
      }
      
      log.debug("fd search completed", { resultCount: results.length });
      return results;
      
    } catch (error) {
      log.error("fd search failed", { error });
      return [];
    }
  }

  /**
   * Quick search using cached results
   */
  async quickSearch(query: string): Promise<FileInfo[]> {
    // For very short queries, just show recent/frequent directories
    if (query.length < 2) {
      return this.getRecentDirectories();
    }
    
    return this.search(query, { maxResults: 10, maxDepth: 2 });
  }

  /**
   * Get recently accessed directories (placeholder for now)
   */
  private async getRecentDirectories(): Promise<FileInfo[]> {
    const homeDir = GLib.get_home_dir();
    return [
      { path: homeDir, name: "Home", isDirectory: true },
      { path: `${homeDir}/Documents`, name: "Documents", isDirectory: true },
      { path: `${homeDir}/Downloads`, name: "Downloads", isDirectory: true },
      { path: `${homeDir}/.config`, name: ".config", isDirectory: true },
      { path: `${homeDir}/Pictures`, name: "Pictures", isDirectory: true },
    ].filter(dir => fileExists(dir.path));
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
    if (this.cacheTimeout) {
      GLib.Source.remove(this.cacheTimeout);
      this.cacheTimeout = null;
    }
  }
}

// Export singleton instance
export default new DirectorySearchService();