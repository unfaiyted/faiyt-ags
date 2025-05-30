// import { GLib } from "astal";
//
// interface SourcePosition {
//   source: string;
//   line: number;
//   column: number;
//   name?: string;
// }
//
// interface RawSourceMap {
//   version: number;
//   sources: string[];
//   names: string[];
//   mappings: string;
//   file?: string;
//   sourceRoot?: string;
//   sourcesContent?: string[];
// }
//
// class SourceMapSupport {
//   private sourceMap?: RawSourceMap;
//   private mappingCache = new Map<string, SourcePosition>();
//
//   constructor() {
//     this.loadSourceMap();
//   }
//
//   private loadSourceMap() {
//     try {
//       // Look for source map in the ags output directory
//       const possiblePaths = [
//         '/run/user/1000/ags.js.map',
//         '/tmp/ags.js.map',
//         `${GLib.get_user_config_dir()}/ags/dist/ags.js.map`,
//         `${GLib.get_user_config_dir()}/ags/build/ags.js.map`
//       ];
//
//       for (const path of possiblePaths) {
//         try {
//           if (GLib.file_test(path, GLib.FileTest.EXISTS)) {
//             const [success, content] = GLib.file_get_contents(path);
//             if (success && content) {
//               const decoder = new TextDecoder();
//               const jsonStr = decoder.decode(content);
//               this.sourceMap = JSON.parse(jsonStr);
//               console.log(`Loaded source map from ${path}`);
//               break;
//             }
//           }
//         } catch (e) {
//           // Continue trying other paths
//         }
//       }
//
//       // Also try to load from inline source map comment in ags.js
//       if (!this.sourceMap) {
//         const agsPath = '/run/user/1000/ags.js';
//         if (GLib.file_test(agsPath, GLib.FileTest.EXISTS)) {
//           const [success, content] = GLib.file_get_contents(agsPath);
//           if (success && content) {
//             const decoder = new TextDecoder();
//             const jsContent = decoder.decode(content);
//             const match = jsContent.match(/\/\/# sourceMappingURL=data:application\/json;base64,(.+)$/m);
//             if (match) {
//               try {
//                 const base64 = match[1];
//                 const decoded = GLib.base64_decode(base64);
//                 const jsonStr = new TextDecoder().decode(decoded);
//                 this.sourceMap = JSON.parse(jsonStr);
//                 console.log('Loaded inline source map from ags.js');
//               } catch (e) {
//                 console.error('Failed to decode inline source map:', e);
//               }
//             }
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Failed to load source map:', error);
//     }
//   }
//
//   /**
//    * Simple heuristic mapping based on file patterns
//    * This is a fallback when proper source maps aren't available
//    */
//   private heuristicMap(file: string, line: number): SourcePosition | null {
//     // Check cache first
//     const cacheKey = `${file}:${line}`;
//     if (this.mappingCache.has(cacheKey)) {
//       return this.mappingCache.get(cacheKey)!;
//     }
//
//     // If it's already a source file, return as is
//     if (file.endsWith('.ts') || file.endsWith('.tsx')) {
//       return { source: file, line, column: 0 };
//     }
//
//     // For ags.js, try to find patterns in the error context
//     if (file === 'ags.js' || file.endsWith('/ags.js')) {
//       // Look at the current error stack to find component names
//       const error = new Error();
//       const stack = error.stack || '';
//
//       // Common component patterns
//       const patterns = [
//         { pattern: /PhosphorIcon|phosphor/i, source: 'src/widget/utils/icons/phosphor.tsx' },
//         { pattern: /Bar|BarModule/i, source: 'src/widget/bar/index.tsx' },
//         { pattern: /Launcher/i, source: 'src/widget/launcher/index.tsx' },
//         { pattern: /Sidebar/i, source: 'src/widget/sidebar/index.tsx' },
//         { pattern: /Overlay/i, source: 'src/widget/overlays/index.tsx' },
//         { pattern: /Logger|createLogger/i, source: 'src/services/logger.ts' },
//       ];
//
//       for (const { pattern, source } of patterns) {
//         if (pattern.test(stack)) {
//           const result = { source, line, column: 0 };
//           this.mappingCache.set(cacheKey, result);
//           return result;
//         }
//       }
//     }
//
//     return null;
//   }
//
//   /**
//    * Map a position in the generated file to the original source
//    */
//   public mapPosition(file: string, line: number, column: number = 0): SourcePosition | null {
//     try {
//       // Clean up the file path
//       let cleanFile = file;
//       if (file.startsWith('file://')) {
//         cleanFile = file.replace('file://', '');
//       }
//
//       // Extract just the filename
//       const parts = cleanFile.split('/');
//       const fileName = parts[parts.length - 1];
//
//       // If we have a proper source map, try to use it
//       if (this.sourceMap && (fileName === 'ags.js' || cleanFile.endsWith('/ags.js'))) {
//         // For now, use heuristic mapping as parsing VLQ mappings is complex
//         // In a real implementation, you'd decode the mappings field
//         return this.heuristicMap(fileName, line);
//       }
//
//       // Try heuristic mapping for any file
//       return this.heuristicMap(fileName, line);
//     } catch (error) {
//       // Silently fail and return null
//     }
//
//     return null;
//   }
//
//   /**
//    * Format a location for display
//    */
//   public formatLocation(file: string, line: number, column?: number): string {
//     const mapped = this.mapPosition(file, line, column || 0);
//     if (mapped) {
//       return `${mapped.source}:${mapped.line}${column ? ':' + mapped.column : ''}`;
//     }
//
//     // Clean up the file path for display
//     let displayFile = file;
//     if (file.includes('/')) {
//       const parts = file.split('/');
//       displayFile = parts[parts.length - 1];
//     }
//
//     // Convert .js to .ts for better readability
//     displayFile = displayFile.replace(/\.js$/, '.ts');
//
//     return `${displayFile}:${line}${column ? ':' + column : ''}`;
//   }
// }
//
// // Export singleton instance
// export const sourceMapSupport = new SourceMapSupport();

