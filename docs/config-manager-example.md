# ConfigManager Example Usage

## How the Config System Works

1. **Default Config** (`src/utils/config.ts`): Contains all default values
2. **User Config** (`~/.config/ags/user-config.json`): Only stores values that differ from defaults
3. **Merged Config**: ConfigManager automatically merges user overrides with defaults

## Setting Your Claude API Key

```typescript
import configManager from './services/config-manager';

// Set your Claude API key
configManager.setValue('ai.providers.claude.apiKey', 'sk-ant-your-key-here');

// The user-config.json will now contain:
// {
//   "ai": {
//     "providers": {
//       "claude": {
//         "apiKey": "sk-ant-your-key-here"
//       }
//     }
//   }
// }
```

## Other Examples

```typescript
// Change weather city
configManager.setValue('weather.city', 'London');

// Change default AI temperature
configManager.setValue('ai.providers.claude.temperature', 0.7);

// Enable model cycling
configManager.setValue('ai.providers.claude.cycleModels', true);

// Get current values
const apiKey = configManager.getValue('ai.providers.claude.apiKey');
const city = configManager.getValue('weather.city');
```

## Why the User Config is Empty Initially

The `user-config.json` file starts as `{}` because:
- It only stores your personal customizations
- Default values come from `src/utils/config.ts`
- This keeps your config file clean and manageable
- You can easily see what you've changed from defaults
- Resetting to defaults is as simple as deleting the file

## Checking Your Config

To see all your customizations:
```bash
cat ~/.config/ags/user-config.json
```

To see the full merged config in code:
```typescript
const fullConfig = configManager.config;
console.log(fullConfig);
```