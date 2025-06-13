import { launcherLogger, setLogLevel, setLogWhitelist, LogLevel } from './src/utils/logger';

// Set debug level to see all logs
setLogLevel(LogLevel.DEBUG);

// Create subclass loggers
const stickerLogger = launcherLogger.subClass('Sticker');
const searchLogger = launcherLogger.subClass('Search');
const configLogger = launcherLogger.subClass('Config');

// Test without filtering
console.log('\n=== Testing without filtering ===');
launcherLogger.info('Starting launcher');
stickerLogger.debug('Loading sticker pack');
searchLogger.info('Performing search query');
configLogger.warn('Config file not found, using defaults');
stickerLogger.error('Failed to load sticker pack');

// Test with whitelist filtering
console.log('\n=== Testing with whitelist ["Launcher/Sticker"] ===');
setLogWhitelist(['Launcher/Sticker']);

launcherLogger.info('This should NOT appear');
stickerLogger.debug('This SHOULD appear - Loading sticker pack');
searchLogger.info('This should NOT appear');
configLogger.warn('This should NOT appear');
stickerLogger.error('This SHOULD appear - Failed to load sticker pack');

// Test with component-level filtering
console.log('\n=== Testing with whitelist ["Launcher"] ===');
setLogWhitelist(['Launcher']);

launcherLogger.info('This SHOULD appear - all Launcher logs');
stickerLogger.debug('This SHOULD appear - subclass of Launcher');
searchLogger.info('This SHOULD appear - subclass of Launcher');
configLogger.warn('This SHOULD appear - subclass of Launcher');

// Test with multiple specific subclasses
console.log('\n=== Testing with whitelist ["Launcher/Sticker", "Launcher/Config"] ===');
setLogWhitelist(['Launcher/Sticker', 'Launcher/Config']);

launcherLogger.info('This should NOT appear - parent component only');
stickerLogger.debug('This SHOULD appear - Sticker subclass');
searchLogger.info('This should NOT appear - Search not in whitelist');
configLogger.warn('This SHOULD appear - Config subclass');

// Reset filtering
console.log('\n=== Testing after removing whitelist ===');
setLogWhitelist(null);

launcherLogger.info('All logs should appear now');
stickerLogger.debug('Sticker debug message');
searchLogger.info('Search info message');
configLogger.warn('Config warning message');

// Demonstrate error with metadata
console.log('\n=== Testing error with metadata ===');
stickerLogger.error('Failed to download sticker pack', {
  packId: '12345',
  error: 'Network timeout',
  retryCount: 3
});

// Test performance timing
console.log('\n=== Testing performance timing ===');
const timer = stickerLogger.time('sticker-download');
setTimeout(() => {
  timer.end('completed successfully');
}, 100);