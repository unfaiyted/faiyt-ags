# ConfigManager Usage Guide

The ConfigManager service provides a centralized way to manage all user configuration for the AGS shell.

## Features

- Load and merge user config with defaults
- Auto-save changes with debouncing
- Dot notation path access
- API key management
- Config import/export
- Section and full reset capabilities

## Basic Usage

```typescript
import configManager from '../services/config-manager';

// Get a config value
const claudeApiKey = configManager.getValue('ai.providers.claude.apiKey');
const theme = configManager.getValue('appearance.defaultMode');

// Set a config value
configManager.setValue('ai.providers.claude.apiKey', 'sk-ant-...');
configManager.setValue('weather.city', 'New York');

// Listen for config changes
configManager.connect('config-changed', (_, path) => {
  console.log(`Config changed at: ${path}`);
});
```

## API Key Management

```typescript
// Set API key for a provider
configManager.setAPIKey('claude', 'sk-ant-...');
configManager.setAPIKey('gemini', 'AIza...');

// Get masked API keys (for display)
const maskedKeys = configManager.getAPIKeys();
// Returns: { claude: 'sk-ant-api...', gemini: 'AIzaSyB7R5...' }
```

## Config Import/Export

```typescript
// Export current config
await configManager.exportConfig('/path/to/backup.json');

// Import config from file
await configManager.importConfig('/path/to/config.json');
```

## Reset Functionality

```typescript
// Reset entire config to defaults
configManager.resetConfig();

// Reset specific section
configManager.resetSection('ai'); // Resets all AI settings
configManager.resetSection('appearance'); // Resets appearance settings
```

## User Config Location

User configuration is stored at: `~/.config/ags/user-config.json`

The config file is automatically created on first use and contains only the values that differ from defaults.

## Example: Updating Claude Settings

```typescript
// Update multiple Claude settings
configManager.setValue('ai.providers.claude.model', 'claude-3-5-sonnet-20241022');
configManager.setValue('ai.providers.claude.temperature', 0.7);
configManager.setValue('ai.providers.claude.maxTokens', 2048);
configManager.setValue('ai.providers.claude.apiKey', 'your-api-key');

// Enable model cycling
configManager.setValue('ai.providers.claude.cycleModels', true);
```

## Config Structure

The configuration follows the structure defined in `types/config.ts`. Major sections include:

- `ai` - AI provider settings and API keys
- `appearance` - Theme and visual settings
- `animations` - Animation timings
- `apps` - Default applications
- `bar` - Bar modes and settings
- `launcher` - Launcher settings
- `sidebar` - Sidebar pages and AI models
- `keybinds` - Keyboard shortcuts

## Auto-save Behavior

Changes are automatically saved after a 1-second debounce period. This prevents excessive file writes when making multiple changes rapidly.

## Error Handling

The ConfigManager handles errors gracefully:
- Corrupt config files are backed up automatically
- Parse errors fall back to defaults
- Failed saves are logged but don't crash the app

## Integration with Services

Services can use ConfigManager to retrieve their settings:

```typescript
// In a service constructor
const config = configManager.getValue('ai.providers.claude');
this.apiKey = config?.apiKey || '';
this.model = config?.model || 'claude-3-5-sonnet-20241022';
```