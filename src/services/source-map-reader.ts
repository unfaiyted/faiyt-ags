import { GLib } from "astal";

interface SourceMapPosition {
  source: string;
  line: number;
  column: number;
  name?: string;
}

interface RawSourceMap {
  version: number;
  sources: string[];
  names: string[];
  mappings: string;
  sourcesContent?: string[];
}

/**
 * Simple VLQ decoder for source map mappings
 */
class VLQDecoder {
  private static VLQ_BASE_SHIFT = 5;
  private static VLQ_BASE = 1 << VLQDecoder.VLQ_BASE_SHIFT;
  private static VLQ_BASE_MASK = VLQDecoder.VLQ_BASE - 1;
  private static VLQ_CONTINUATION_BIT = VLQDecoder.VLQ_BASE;

  private static charToInt: Record<string, number> = {};
  private static intToChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  static {
    for (let i = 0; i < this.intToChar.length; i++) {
      this.charToInt[this.intToChar[i]] = i;
    }
  }

  static decode(encoded: string): number[] {
    const result: number[] = [];
    let shift = 0;
    let value = 0;

    for (let i = 0; i < encoded.length; i++) {
      const digit = this.charToInt[encoded[i]];
      if (digit === undefined) {
        throw new Error(`Invalid character: ${encoded[i]}`);
      }

      const hasContinuation = (digit & this.VLQ_CONTINUATION_BIT) !== 0;
      const digitValue = digit & this.VLQ_BASE_MASK;
      value += digitValue << shift;

      if (hasContinuation) {
        shift += this.VLQ_BASE_SHIFT;
      } else {
        const shouldNegate = (value & 1) === 1;
        value >>>= 1;
        if (shouldNegate) {
          value = -value;
        }
        result.push(value);
        value = 0;
        shift = 0;
      }
    }

    return result;
  }
}

export class SourceMapReader {
  private sourceMap?: RawSourceMap;
  private mappingLines?: Array<Array<[number, number, number, number, number?]>>;

  constructor() {
    this.loadSourceMap();
  }

  private loadSourceMap() {
    try {
      const agsPath = '/run/user/1000/ags.js';
      if (!GLib.file_test(agsPath, GLib.FileTest.EXISTS)) {
        console.error('AGS file not found');
        return;
      }

      const [success, content] = GLib.file_get_contents(agsPath);
      if (!success || !content) {
        console.error('Failed to read AGS file');
        return;
      }

      const decoder = new TextDecoder();
      const jsContent = decoder.decode(content);
      
      // Look for inline source map
      const match = jsContent.match(/\/\/# sourceMappingURL=data:application\/json;base64,(.+)$/m);
      if (!match) {
        console.error('No inline source map found');
        return;
      }

      const base64 = match[1];
      const decoded = GLib.base64_decode(base64);
      const jsonStr = new TextDecoder().decode(decoded);
      this.sourceMap = JSON.parse(jsonStr);
      
      // Parse the mappings
      this.parseMappings();
      
      console.log(`Loaded source map with ${this.sourceMap.sources.length} sources`);
    } catch (error) {
      console.error('Failed to load source map:', error);
    }
  }

  private parseMappings() {
    if (!this.sourceMap) return;

    this.mappingLines = [];
    const lines = this.sourceMap.mappings.split(';');
    
    let generatedColumn = 0;
    let sourceIndex = 0;
    let sourceLine = 0;
    let sourceColumn = 0;
    let nameIndex = 0;

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
      const line = lines[lineNumber];
      const segments: Array<[number, number, number, number, number?]> = [];
      generatedColumn = 0;

      const segmentStrs = line.split(',');
      for (const segment of segmentStrs) {
        if (!segment) continue;

        const decoded = VLQDecoder.decode(segment);
        if (decoded.length === 0) continue;

        // Generated column (always present)
        generatedColumn += decoded[0];

        if (decoded.length === 1) continue;

        // Source index
        sourceIndex += decoded[1];
        // Source line
        sourceLine += decoded[2];
        // Source column
        sourceColumn += decoded[3];

        // Optional name index
        let mappedName: number | undefined;
        if (decoded.length >= 5) {
          nameIndex += decoded[4];
          mappedName = nameIndex;
        }

        segments.push([generatedColumn, sourceIndex, sourceLine, sourceColumn, mappedName]);
      }

      this.mappingLines.push(segments);
    }
  }

  /**
   * Find the original position for a generated position
   */
  public originalPositionFor(line: number, column: number): SourceMapPosition | null {
    if (!this.sourceMap || !this.mappingLines) return null;

    // Adjust for 0-based indexing
    const lineIndex = line - 1;
    if (lineIndex < 0 || lineIndex >= this.mappingLines.length) return null;

    const segments = this.mappingLines[lineIndex];
    if (!segments || segments.length === 0) return null;

    // Find the segment that contains our column
    let bestSegment: [number, number, number, number, number?] | null = null;
    for (const segment of segments) {
      if (segment[0] <= column) {
        bestSegment = segment;
      } else {
        break;
      }
    }

    if (!bestSegment) return null;

    const [, sourceIndex, sourceLine, sourceColumn, nameIndex] = bestSegment;
    
    if (sourceIndex < 0 || sourceIndex >= this.sourceMap.sources.length) return null;

    let source = this.sourceMap.sources[sourceIndex];
    
    // Clean up the source path
    if (source.startsWith('../../../')) {
      source = source.substring(9); // Remove ../../../
    }
    
    // Convert absolute paths to relative
    const configDir = 'home/faiyt/.config/ags/';
    if (source.startsWith(configDir)) {
      source = source.substring(configDir.length);
    }

    return {
      source,
      line: sourceLine + 1, // Convert back to 1-based
      column: sourceColumn,
      name: nameIndex !== undefined ? this.sourceMap.names[nameIndex] : undefined
    };
  }

  /**
   * Get a source location string for a generated position
   */
  public getSourceLocation(file: string, line: number, column?: number): string {
    if (!file.endsWith('ags.js')) {
      return `${file}:${line}${column !== undefined ? ':' + column : ''}`;
    }

    const original = this.originalPositionFor(line, column || 0);
    if (original) {
      return `${original.source}:${original.line}${original.column !== undefined ? ':' + original.column : ''}`;
    }

    return `${file}:${line}${column !== undefined ? ':' + column : ''}`;
  }
}

// Export singleton
export const sourceMapReader = new SourceMapReader();