import { subprocess } from "astal";
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
            this.process.connect("exit", () => {
                console.log("Apple TV service exited");
                this.ready = false;
                this.isConnected.set(false);
                this.connectionStatus.set("Service stopped");
                this.process = null;
                
                // Restart after a delay
                setTimeout(() => this.startService(), 5000);
            });
            
        } catch (error) {
            console.error("Failed to start Apple TV service:", error);
            this.connectionStatus.set("Failed to start service");
        }
    }
    
    private handleResponse(response: AppleTVResponse) {
        // Handle ready signal
        if (response.ready) {
            this.ready = true;
            this.connecting = false;
            this.isConnected.set(response.connected || false);
            this.connectionStatus.set(response.connected ? "Connected" : "Ready");
            
            // Process queued commands
            while (this.commandQueue.length > 0 && this.ready) {
                const cmd = this.commandQueue.shift();
                if (cmd) {
                    this.sendCommand(cmd.command).then(cmd.resolve).catch(cmd.reject);
                }
            }
            return;
        }
        
        // Handle connection status
        if ('connected' in response) {
            this.isConnected.set(response.connected || false);
            this.connectionStatus.set(response.connected ? "Connected" : "Disconnected");
            this.connecting = false;
        }
        
        // Resolve the oldest pending command
        if (this.commandQueue.length > 0) {
            const cmd = this.commandQueue.shift();
            if (cmd) {
                if (response.error) {
                    cmd.reject(new Error(response.error));
                } else {
                    cmd.resolve(response);
                }
            }
        }
    }
    
    private async sendCommand(command: AppleTVCommand): Promise<AppleTVResponse> {
        if (!this.process) {
            await this.startService();
            // Wait a bit for service to start
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        if (!this.ready && command.command !== 'connect') {
            // Queue command if not ready
            return new Promise((resolve, reject) => {
                this.commandQueue.push({ command, resolve, reject });
            });
        }
        
        return new Promise((resolve, reject) => {
            try {
                const cmdStr = JSON.stringify(command) + '\n';
                this.process.write(cmdStr);
                
                // Add to queue to handle response
                this.commandQueue.push({ command, resolve, reject });
                
                // Shorter timeout for better responsiveness
                setTimeout(() => {
                    const index = this.commandQueue.findIndex(c => c.command === command);
                    if (index >= 0) {
                        this.commandQueue.splice(index, 1);
                        reject(new Error("Command timeout"));
                    }
                }, 2000);
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