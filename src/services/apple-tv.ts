import { subprocess, execAsync } from "astal";
import { Variable } from "astal";

interface AppleTVCommand {
    command: string;
    device_id?: string;
}

interface AppleTVResponse {
    success?: boolean;
    error?: string;
    connected?: boolean;
    ready?: boolean;
    command?: string;
}

class AppleTVService {
    private static instance: AppleTVService;
    private process: any = null;
    private commandQueue: Array<{ command: AppleTVCommand; resolve: (value: AppleTVResponse) => void; reject: (error: any) => void }> = [];
    private ready = false;
    private connecting = false;
    
    public isConnected = Variable(false);
    public connectionStatus = Variable("Disconnected");
    
    private constructor() {
        this.startService();
    }
    
    static getInstance(): AppleTVService {
        if (!AppleTVService.instance) {
            AppleTVService.instance = new AppleTVService();
        }
        return AppleTVService.instance;
    }
    
    private async startService() {
        if (this.process) {
            return;
        }
        
        console.log("Starting Apple TV service...");
        this.connectionStatus.set("Starting service...");
        
        // Kill any existing Python processes first
        try {
            await execAsync(["pkill", "-f", "apple-tv.*\\.py"]);
            console.log("Killed existing Apple TV Python processes");
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (e) {
            // Ignore errors if no processes to kill
        }
        
        try {
            this.process = subprocess(
                ["python3", "/home/faiyt/.config/ags/scripts/remote-control/apple-tv-service.py"],
                (stdout, stderr) => {
                    if (stdout) {
                        const lines = stdout.trim().split('\n');
                        for (const line of lines) {
                            if (line.trim()) {
                                try {
                                    const response = JSON.parse(line);
                                    this.handleResponse(response);
                                } catch (e) {
                                    console.error("Failed to parse service response:", line);
                                }
                            }
                        }
                    }
                    if (stderr) {
                        console.error("Apple TV service stderr:", stderr);
                    }
                }
            );
            
            // Set up process exit handler
            this.process.connect("exit", (code: number) => {
                console.log(`Apple TV service exited with code ${code}`);
                this.ready = false;
                this.isConnected.set(false);
                this.connectionStatus.set("Service stopped");
                this.process = null;
                
                // Clear any pending commands
                while (this.commandQueue.length > 0) {
                    const cmd = this.commandQueue.shift();
                    if (cmd) {
                        cmd.reject(new Error("Service stopped"));
                    }
                }
                
                // Restart after a delay
                setTimeout(() => this.startService(), 3000);
            });
            
        } catch (error) {
            console.error("Failed to start Apple TV service:", error);
            this.connectionStatus.set("Failed to start service");
        }
    }
    
    private blockedErrorCount = 0;
    private lastBlockedTime = 0;
    
    private handleResponse(response: AppleTVResponse) {
        // Handle debug messages
        if ('debug' in response) {
            console.log("[AppleTV Debug]", response.debug);
        }
        
        // Handle ready signal
        if (response.ready) {
            this.ready = true;
            this.connecting = false;
            this.isConnected.set(response.connected || false);
            this.connectionStatus.set(response.connected ? "Connected" : "Ready");
            this.blockedErrorCount = 0; // Reset error count on successful ready
            return;
        }
        
        // Handle connection status
        if ('connected' in response) {
            this.isConnected.set(response.connected || false);
            this.connectionStatus.set(response.connected ? "Connected" : "Disconnected");
            this.connecting = false;
            if (response.connected) {
                this.blockedErrorCount = 0; // Reset error count on successful connection
            }
        }
        
        // Handle reconnection success
        if (response.success && 'reconnected' in response && response.reconnected) {
            console.log("[AppleTV] Successfully reconnected and executed command");
            this.isConnected.set(true);
            this.connectionStatus.set("Connected");
            this.blockedErrorCount = 0; // Reset error count
        }
        
        // Resolve the oldest pending command
        if (this.commandQueue.length > 0) {
            const cmd = this.commandQueue.shift();
            if (cmd) {
                if (response.error) {
                    // Check for blocked errors
                    if (response.error.includes("is blocked")) {
                        const now = Date.now();
                        // Count blocked errors within a 10 second window
                        if (now - this.lastBlockedTime < 10000) {
                            this.blockedErrorCount++;
                        } else {
                            this.blockedErrorCount = 1;
                        }
                        this.lastBlockedTime = now;
                        
                        console.error(`[AppleTV] Blocked error #${this.blockedErrorCount}: ${response.error}`);
                        
                        // If we get too many blocked errors, restart the service
                        if (this.blockedErrorCount >= 3) {
                            console.error("[AppleTV] Too many blocked errors, restarting service...");
                            this.restart();
                        }
                    }
                    // Check if it's a connection error
                    else if (response.error.includes("Connection lost") || response.error.includes("Not connected")) {
                        this.isConnected.set(false);
                        this.connectionStatus.set("Disconnected");
                    }
                    cmd.reject(new Error(response.error));
                } else {
                    cmd.resolve(response);
                    // Reset error count on successful command
                    if (response.success) {
                        this.blockedErrorCount = 0;
                    }
                }
            }
        }
    }
    
    private async processQueuedCommands() {
        // This method is no longer needed - commands are processed through the queue
        // The queue is handled by handleResponse when responses come back
    }
    
    private async sendCommand(command: AppleTVCommand): Promise<AppleTVResponse> {
        if (!this.process) {
            await this.startService();
            // Wait a bit for service to start
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        if (!this.ready && command.command !== 'connect') {
            // Wait for ready state instead of queuing
            await new Promise(resolve => setTimeout(resolve, 500));
            if (!this.ready) {
                throw new Error("Service not ready");
            }
        }
        
        return new Promise((resolve, reject) => {
            try {
                const cmdStr = JSON.stringify(command) + '\n';
                this.process.write(cmdStr);
                
                // Add to queue to handle response
                this.commandQueue.push({ command, resolve, reject });
                
                // Reasonable timeout with automatic retry
                const timeoutId = setTimeout(() => {
                    const index = this.commandQueue.findIndex(c => c.command === command);
                    if (index >= 0) {
                        this.commandQueue.splice(index, 1);
                        // For connection commands, use longer timeout
                        if (command.command === 'connect') {
                            reject(new Error("Connection timeout"));
                        } else {
                            // For regular commands, could retry once
                            reject(new Error("Command timeout"));
                        }
                    }
                }, command.command === 'connect' ? 10000 : 5000);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    async connect(deviceId: string): Promise<boolean> {
        if (this.connecting) {
            return false;
        }
        
        this.connecting = true;
        this.connectionStatus.set("Connecting...");
        
        try {
            const response = await this.sendCommand({ command: "connect", device_id: deviceId });
            return response.connected || false;
        } catch (error) {
            console.error("Failed to connect:", error);
            this.connectionStatus.set("Connection failed");
            return false;
        } finally {
            this.connecting = false;
        }
    }
    
    async sendRemoteCommand(command: string): Promise<boolean> {
        try {
            const response = await this.sendCommand({ command });
            return response.success || false;
        } catch (error) {
            console.error(`Failed to send command ${command}:`, error);
            
            // If it's a timeout, try once more
            if (error.message === "Command timeout") {
                console.log(`Retrying command ${command}...`);
                try {
                    const response = await this.sendCommand({ command });
                    return response.success || false;
                } catch (retryError) {
                    console.error(`Retry failed for ${command}:`, retryError);
                }
            }
            
            return false;
        }
    }
    
    async disconnect() {
        try {
            await this.sendCommand({ command: "disconnect" });
        } catch (error) {
            console.error("Failed to disconnect:", error);
        }
    }
    
    async restart() {
        console.log("Restarting Apple TV service...");
        this.destroy();
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.startService();
    }
    
    destroy() {
        if (this.process) {
            this.process.kill();
            this.process = null;
        }
        this.ready = false;
        this.isConnected.set(false);
    }
}

export default AppleTVService;