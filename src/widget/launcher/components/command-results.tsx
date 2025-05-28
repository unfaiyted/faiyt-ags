import { Variable } from "astal";
import { CommandOption } from "../buttons/command-button";
import { launcherLogger as log } from "../../../utils/logger";

export interface CommandButtonResult {
  command: CommandOption;
  index: number;
}

// Command history (in memory for now)
// Initialize with some common commands for demonstration
const commandHistory = Variable<string[]>([
  "ls -la",
  "htop",
  "nvim",
  "git status",
  "systemctl status"
]);

export default function getCommandResults(searchText: string, isPrefixSearch: boolean = false): CommandButtonResult[] {
  const query = searchText.trim();
  log.debug("Getting command results", { query, isPrefixSearch });
  
  // If empty query with prefix, show history
  if (isPrefixSearch && query === '') {
    const history = commandHistory.get();
    log.debug("Returning command history", { historyCount: history.length });
    return history.slice(0, 5).map((cmd, index) => ({
      command: {
        command: cmd,
        description: "Previously run command",
        icon: "utilities-terminal-symbolic"
      },
      index
    }));
  }

  // If it's a valid command query, return it
  if (query.length > 0) {
    // Check if it's requesting terminal mode
    const inTerminal = query.startsWith('!');
    const actualCommand = inTerminal ? query.substring(1).trim() : query;
    
    // Try to detect what type of command it is
    const isValidCommand = detectCommandType(actualCommand);
    
    if (isValidCommand) {
      return [{
        command: {
          command: actualCommand,
          description: inTerminal ? "Run in terminal" : "Run command",
          icon: inTerminal ? "utilities-terminal-symbolic" : "system-run-symbolic",
          terminal: inTerminal
        },
        index: 0
      }];
    }
  }

  return [];
}

function detectCommandType(command: string): boolean {
  // Simple validation - just check if it has at least one word
  const parts = command.split(/\s+/);
  if (parts.length === 0 || parts[0] === '') return false;
  
  // You could add more sophisticated validation here
  // For now, assume any non-empty string is a valid command
  return true;
}

// Function to add command to history
export function addToCommandHistory(command: string) {
  const history = commandHistory.get();
  // Remove duplicates and add to front
  const newHistory = [command, ...history.filter(cmd => cmd !== command)].slice(0, 50);
  commandHistory.set(newHistory);
  log.debug("Added to command history", { command, historySize: newHistory.length });
}