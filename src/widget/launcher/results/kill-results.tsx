import { KillAction } from "../buttons/kill-button";
import { launcherLogger as log } from "../../../utils/logger";
import { execAsync } from "astal/process";

export interface KillButtonResult {
  action: KillAction;
  index: number;
}

// Cache for process and port data
interface KillCache {
  portProcesses: KillAction[];
  allProcesses: KillAction[];
  timestamp: number;
}

let cache: KillCache | null = null;
const CACHE_DURATION = 10000; // 10 seconds in milliseconds

// Helper to check if cache is valid
function isCacheValid(): boolean {
  if (!cache) return false;
  const now = Date.now();
  return (now - cache.timestamp) < CACHE_DURATION;
}

// Helper to get processes listening on ports
async function getPortProcesses(): Promise<KillAction[]> {
  try {
    // First try ss command (more common and doesn't require root)
    let output = '';
    try {
      // Try ss without -p flag first (doesn't need root)
      output = await execAsync(['bash', '-c', 
        'ss -tln 2>/dev/null | grep LISTEN | awk \'{print $4}\' | grep -o "[0-9]\\+$" | sort -u'
      ]);
    } catch (ssError) {
      // If ss fails, try netstat
      try {
        output = await execAsync(['bash', '-c', 
          'netstat -tln 2>/dev/null | grep LISTEN | awk \'{print $4}\' | grep -o "[0-9]\\+$" | sort -u'
        ]);
      } catch (netstatError) {
        // Last resort: try lsof (might need sudo)
        try {
          output = await execAsync(['bash', '-c', 
            'lsof -iTCP -sTCP:LISTEN -P -n 2>/dev/null | grep -v "^COMMAND" | awk \'{print $9}\' | grep -o "[0-9]\\+$" | sort -u'
          ]);
        } catch (lsofError) {
          log.error("All port scanning methods failed", { ssError, netstatError, lsofError });
          return [];
        }
      }
    }
    
    const ports = output.trim().split('\n').filter(line => line.length > 0);
    const portActions: KillAction[] = [];
    const seenPorts = new Set<number>();
    
    for (const portStr of ports) {
      const port = parseInt(portStr);
      if (isNaN(port) || seenPorts.has(port)) continue;
      seenPorts.add(port);
      
      // Try to get process info for this port
      let processInfo = '';
      try {
        // Try to find process using the port
        const pidOutput = await execAsync(['bash', '-c', 
          `lsof -ti:${port} 2>/dev/null | head -1`
        ]);
        const pid = pidOutput.trim();
        
        if (pid) {
          // Get process name
          const nameOutput = await execAsync(['bash', '-c', 
            `ps -p ${pid} -o comm= 2>/dev/null`
          ]);
          processInfo = nameOutput.trim();
        }
      } catch (e) {
        // Fallback: try fuser
        try {
          const fuserOutput = await execAsync(['bash', '-c', 
            `fuser ${port}/tcp 2>/dev/null | awk '{print $1}'`
          ]);
          const pid = fuserOutput.trim();
          if (pid) {
            const nameOutput = await execAsync(['bash', '-c', 
              `ps -p ${pid} -o comm= 2>/dev/null`
            ]);
            processInfo = nameOutput.trim();
          }
        } catch (e2) {
          processInfo = 'Unknown';
        }
      }
      
      portActions.push({
        type: 'port',
        name: `Port ${port}${processInfo ? ` (${processInfo})` : ''}`,
        description: `Kill process listening on port ${port}`,
        icon: 'network-server-symbolic',
        port: port
      });
    }
    
    return portActions;
  } catch (err) {
    log.error("Failed to get port processes", { error: err });
    return [];
  }
}

// Helper to get all running processes (cached)
async function getAllRunningProcesses(): Promise<KillAction[]> {
  try {
    // Get processes with their command lines
    const output = await execAsync(['bash', '-c', 
      'ps aux | grep -v "^USER" | awk \'{print $2, $11, $1, $3, $4}\''
    ]);
    
    const lines = output.trim().split('\n').filter(line => line.length > 0);
    const processActions: KillAction[] = [];
    const addedPids = new Set<number>();
    
    for (const line of lines) {
      const [pid, command, user, cpu, mem] = line.split(' ');
      const pidNum = parseInt(pid);
      
      // Skip if we've already added this PID
      if (addedPids.has(pidNum)) continue;
      
      // Extract process name from command path
      const processName = command.split('/').pop() || command;
      
      addedPids.add(pidNum);
      processActions.push({
        type: 'process',
        name: processName,
        description: `${user} - CPU: ${cpu}% MEM: ${mem}% - PID: ${pid}`,
        icon: 'application-x-executable-symbolic',
        pid: pidNum,
        processName: processName,
        command: command // Store full command for better filtering
      });
    }
    
    // Sort by CPU usage (descending)
    return processActions.sort((a, b) => {
      const cpuA = parseFloat(a.description.match(/CPU: ([\d.]+)%/)?.[1] || '0');
      const cpuB = parseFloat(b.description.match(/CPU: ([\d.]+)%/)?.[1] || '0');
      return cpuB - cpuA;
    });
  } catch (err) {
    log.error("Failed to get running processes", { error: err });
    return [];
  }
}

export default async function getKillResults(searchText: string, isPrefixSearch: boolean = false): Promise<KillButtonResult[]> {
  const query = searchText.toLowerCase().trim();
  
  log.debug("Getting kill results", { query, isPrefixSearch, cacheValid: isCacheValid() });
  
  const results: KillAction[] = [];
  
  // Check if user is filtering by type
  const showOnlyPorts = query.startsWith('port');
  const showOnlyProcesses = query.startsWith('proc') || query.startsWith('ps');
  const showOnlyClick = query.startsWith('click') || query.startsWith('window');
  
  // Get the actual search query after type filter
  let actualQuery = query;
  if (showOnlyPorts) {
    actualQuery = query.replace(/^port\s*/i, '').trim();
  } else if (showOnlyProcesses) {
    actualQuery = query.replace(/^(proc|ps)\s*/i, '').trim();
  } else if (showOnlyClick) {
    actualQuery = query.replace(/^(click|window)\s*/i, '').trim();
  }
  
  // Add click-to-kill option if not filtering by type or if specifically requested
  if (!showOnlyPorts && !showOnlyProcesses) {
    results.push({
      type: 'window-click',
      name: 'Kill by Click',
      description: 'Click on any window to kill it',
      icon: 'edit-select-symbolic'
    });
  }
  
  // Check if we need to refresh the cache
  if (!isCacheValid()) {
    log.debug("Cache expired or missing, fetching fresh data...");
    
    // Fetch data in parallel for better performance
    const [portProcesses, allProcesses] = await Promise.all([
      getPortProcesses(),
      getAllRunningProcesses()
    ]);
    
    // Update cache
    cache = {
      portProcesses,
      allProcesses,
      timestamp: Date.now()
    };
    
    log.debug("Cache updated", { 
      portCount: portProcesses.length, 
      processCount: allProcesses.length 
    });
  } else {
    log.debug("Using cached data");
  }
  
  // Add port processes if not filtering for processes only
  if (!showOnlyProcesses && !showOnlyClick) {
    // Filter port processes by actual query
    const filteredPorts = actualQuery ? 
      cache!.portProcesses.filter(p => 
        p.name.toLowerCase().includes(actualQuery) || 
        p.description.toLowerCase().includes(actualQuery)
      ) : cache!.portProcesses;
    
    results.push(...filteredPorts);
  }
  
  // Add running processes if not filtering for ports only
  if (!showOnlyPorts && !showOnlyClick) {
    // Filter running processes by actual query
    const filteredProcesses = actualQuery ?
      cache!.allProcesses.filter(p => 
        p.name.toLowerCase().includes(actualQuery) || 
        p.description.toLowerCase().includes(actualQuery) ||
        (p.command && p.command.toLowerCase().includes(actualQuery))
      ) : cache!.allProcesses;
    
    // Limit the number of process results to avoid overwhelming the UI
    const maxProcesses = 20;
    results.push(...filteredProcesses.slice(0, maxProcesses));
  }
  
  log.debug("Kill results", { 
    totalResults: results.length,
    showOnlyPorts,
    showOnlyProcesses,
    showOnlyClick,
    actualQuery,
    fromCache: true
  });
  
  return results.map((action, index) => ({
    action,
    index
  }));
}

// Export a function to clear the cache when needed
export function clearKillCache() {
  cache = null;
  log.debug("Kill cache cleared");
}