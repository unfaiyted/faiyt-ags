#!/usr/bin/env python3
"""
Apple TV control script using pyatv
Handles device discovery, connection, and remote control commands
"""

import asyncio
import json
import sys
import os
import warnings
import pickle
import time
from typing import Optional, Dict, Any

# Suppress all warnings
warnings.filterwarnings('ignore')
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'

# Redirect stderr to devnull to suppress all protobuf warnings
stderr = sys.stderr
try:
    sys.stderr = open(os.devnull, 'w')
    import pyatv
    from pyatv.interface import RemoteControl, Playing
    # PowerState might not exist in all versions
    try:
        from pyatv.interface import PowerState
    except ImportError:
        PowerState = None
except ImportError as e:
    sys.stderr = stderr
    print(json.dumps({"error": f"pyatv import failed: {str(e)}. Please run: pip install pyatv"}))
    sys.exit(1)
except Exception as e:
    sys.stderr = stderr
    print(json.dumps({"error": f"Failed to import pyatv: {str(e)}"}))
    sys.exit(1)
finally:
    # Keep stderr suppressed for the rest of execution
    pass

class AppleTVController:
    def __init__(self):
        self.atv = None
        self.remote = None
        self.config_file = os.path.expanduser("~/.config/ags/appletv-config.json")
        self.pairing_session_file = os.path.expanduser("~/.config/ags/appletv-pairing-session.pkl")
        
    async def discover_devices(self) -> list:
        """Discover Apple TV devices on the network"""
        try:
            # Get the current event loop
            loop = asyncio.get_running_loop()
            devices = await pyatv.scan(loop, timeout=5)
            return [
                {
                    "name": device.name or f"Apple TV ({device.address})",
                    "address": str(device.address),
                    "identifier": str(device.identifier),
                    "services": []  # Skip services to avoid attribute errors
                }
                for device in devices
            ]
        except Exception as e:
            # Return empty list on error
            return []
    
    async def connect(self, identifier: str) -> bool:
        """Connect to a specific Apple TV device"""
        try:
            # Get the current event loop
            loop = asyncio.get_running_loop()
            devices = await pyatv.scan(loop, timeout=5)
            
            for device in devices:
                if str(device.identifier) == identifier:
                    # Check for stored credentials
                    credentials_file = os.path.expanduser("~/.config/ags/appletv-credentials.json")
                    if os.path.exists(credentials_file):
                        try:
                            with open(credentials_file, "r") as f:
                                stored_credentials = json.load(f)
                                if identifier in stored_credentials:
                                    # Apply stored credentials
                                    for protocol_name, creds in stored_credentials[identifier].items():
                                        try:
                                            if protocol_name.lower() == 'companion':
                                                protocol = pyatv.Protocol.Companion
                                            elif protocol_name.lower() == 'airplay':
                                                protocol = pyatv.Protocol.AirPlay
                                            elif protocol_name.lower() == 'mrp':
                                                protocol = pyatv.Protocol.MRP
                                            elif protocol_name.lower() == 'raop':
                                                protocol = pyatv.Protocol.RAOP
                                            elif protocol_name.lower() == 'dmap':
                                                protocol = pyatv.Protocol.DMAP
                                            else:
                                                print(f"Unknown protocol: {protocol_name}", file=sys.stderr)
                                                continue
                                            
                                            device.set_credentials(protocol, creds)
                                            print(f"Applied {protocol_name} credentials for protocol {protocol}", file=sys.stderr)
                                        except Exception as e:
                                            print(f"Failed to apply {protocol_name} credentials: {e}", file=sys.stderr)
                        except Exception as e:
                            print(f"Failed to load credentials: {e}", file=sys.stderr)
                    
                    print(f"Connecting to device {device.name} with {len(device.services)} services", file=sys.stderr)
                    print(f"Services: {[s.protocol.name for s in device.services]}", file=sys.stderr)
                    
                    self.atv = await pyatv.connect(device, loop)
                    if self.atv:
                        self.remote = self.atv.remote_control
                        print(f"Connected! Remote control available: {self.remote is not None}", file=sys.stderr)
                        return True
                    else:
                        print(f"Connection failed", file=sys.stderr)
                        return False
            return False
        except Exception as e:
            print(f"Connection error: {e}", file=sys.stderr)
            return False
    
    async def disconnect(self):
        """Disconnect from Apple TV"""
        if self.atv:
            self.atv.close()
            self.atv = None
            self.remote = None
    
    async def send_command(self, command: str) -> Dict[str, Any]:
        """Send remote control command to Apple TV"""
        if not self.atv:
            return {"error": "Not connected to Apple TV"}
        
        if not self.remote:
            return {"error": "Remote control not available"}
        
        try:
            # Debug: Check what protocols are connected
            connected_protocols = []
            if hasattr(self.atv, 'services'):
                for service in self.atv.services:
                    connected_protocols.append(service.protocol.name)
            
            print(f"Connected protocols: {connected_protocols}", file=sys.stderr)
            print(f"Remote control type: {type(self.remote)}", file=sys.stderr)
            
            # First check if we're actually connected
            if not hasattr(self.remote, command):
                # Try to see what methods are available
                available = [m for m in dir(self.remote) if not m.startswith('_') and callable(getattr(self.remote, m, None))]
                return {"error": f"Command '{command}' not available. Available: {', '.join(available[:10])}..."}
            
            # Get the method and call it
            method = getattr(self.remote, command)
            await method()
            
            return {"success": True, "command": command}
        except Exception as e:
            # Get more detailed error info
            error_msg = str(e)
            if "not supported" in error_msg:
                return {"error": f"{command} is not supported. The Apple TV might need to be paired first."}
            return {"error": f"Command failed: {error_msg}"}
    
    async def get_playing_info(self) -> Dict[str, Any]:
        """Get current playing information"""
        if not self.atv:
            return {"error": "Not connected to Apple TV"}
        
        try:
            playing = await self.atv.metadata.playing()
            power_state = self.atv.power.power_state if hasattr(self.atv, 'power') else None
            
            return {
                "title": playing.title or "Unknown",
                "artist": playing.artist or "",
                "album": playing.album or "",
                "genre": playing.genre or "",
                "total_time": playing.total_time,
                "position": playing.position,
                "repeat": str(playing.repeat) if playing.repeat else "Off",
                "shuffle": str(playing.shuffle) if playing.shuffle else "Off",
                "device_state": str(playing.device_state) if playing.device_state else "Unknown",
                "power_state": str(power_state) if power_state else "Unknown"
            }
        except Exception as e:
            return {"error": str(e)}
    
    def save_config(self, identifier: str):
        """Save the device identifier to config file"""
        config = {"default_device": identifier}
        os.makedirs(os.path.dirname(self.config_file), exist_ok=True)
        with open(self.config_file, "w") as f:
            json.dump(config, f, indent=2)
    
    def load_config(self) -> Optional[str]:
        """Load the default device identifier from config"""
        if os.path.exists(self.config_file):
            try:
                with open(self.config_file, "r") as f:
                    config = json.load(f)
                    return config.get("default_device")
            except:
                pass
        return None

async def main():
    # Suppress stderr for the entire execution
    sys.stderr = open(os.devnull, 'w')
    
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No command specified"}))
        sys.exit(1)
    
    command = sys.argv[1]
    controller = AppleTVController()
    
    try:
        if command == "scan-ip":
            # Scan a specific IP address
            if len(sys.argv) < 3:
                print(json.dumps({"error": "IP address required"}))
                sys.exit(1)
            
            ip_address = sys.argv[2]
            try:
                loop = asyncio.get_running_loop()
                # Try to scan the specific IP
                devices = await pyatv.scan(loop, hosts=[ip_address], timeout=5)
                if devices:
                    device = devices[0]
                    result = {
                        "name": device.name or f"Apple TV at {ip_address}",
                        "address": str(device.address),
                        "identifier": str(device.identifier),
                        "services": []  # Services info might not be available
                    }
                    print(json.dumps({"device": result}))
                else:
                    print(json.dumps({"error": f"No Apple TV found at {ip_address}"}))
            except Exception as e:
                print(json.dumps({"error": f"Failed to scan {ip_address}: {str(e)}"}))
            
        elif command == "discover":
            devices = await controller.discover_devices()
            print(json.dumps({"devices": devices}))
        
        elif command == "connect":
            if len(sys.argv) < 3:
                # Try to connect to default device
                identifier = controller.load_config()
                if not identifier:
                    print(json.dumps({"error": "No device identifier provided and no default configured"}))
                    sys.exit(1)
            else:
                identifier = sys.argv[2]
                controller.save_config(identifier)
            
            success = await controller.connect(identifier)
            if success:
                print(json.dumps({"connected": True, "identifier": identifier}))
            else:
                print(json.dumps({"error": "Failed to connect to device"}))
        
        elif command == "pair":
            if len(sys.argv) < 3:
                identifier = controller.load_config()
                if not identifier:
                    print(json.dumps({"error": "No device configured. Please select a device first."}))
                    sys.exit(1)
            else:
                identifier = sys.argv[2]
            
            # First, let's try to find the device
            loop = asyncio.get_running_loop()
            devices = await pyatv.scan(loop, timeout=5)
            
            device = None
            for d in devices:
                if str(d.identifier) == identifier:
                    device = d
                    break
            
            if not device:
                print(json.dumps({"error": f"Device {identifier} not found"}))
                sys.exit(1)
            
            # Check if we have stored credentials
            credentials_file = os.path.expanduser("~/.config/ags/appletv-credentials.json")
            stored_credentials = {}
            
            if os.path.exists(credentials_file):
                try:
                    with open(credentials_file, "r") as f:
                        stored_credentials = json.load(f)
                except:
                    pass
            
            # Try to connect with stored credentials first
            if identifier in stored_credentials:
                try:
                    # Apply stored credentials to the device config
                    for protocol, creds in stored_credentials[identifier].items():
                        device.set_credentials(pyatv.Protocol[protocol.upper()], creds)
                    
                    atv = await pyatv.connect(device, loop)
                    if atv:
                        atv.close()
                        print(json.dumps({"success": True, "message": "Already paired with stored credentials"}))
                        sys.exit(0)
                except:
                    pass
            
            # If we get here, we need to pair
            print(json.dumps({
                "pairing": "started",
                "message": "Starting pairing process...",
                "identifier": identifier
            }))
            sys.stdout.flush()  # Ensure output is sent immediately
            
            # Use pyatv's pairing API
            try:
                # Try to determine the best protocol to use for pairing
                protocol = None
                available_protocols = []
                
                for service in device.services:
                    available_protocols.append(service.protocol.name)
                    # Prefer Companion for remote control
                    if service.protocol == pyatv.Protocol.Companion:
                        protocol = pyatv.Protocol.Companion
                        break
                    elif service.protocol == pyatv.Protocol.AirPlay and not protocol:
                        protocol = pyatv.Protocol.AirPlay
                
                print(json.dumps({"debug": f"Available protocols: {available_protocols}, selected: {protocol.name if protocol else 'None'}"}))
                sys.stdout.flush()
                
                if not protocol:
                    # Try all common protocols
                    for proto in [pyatv.Protocol.Companion, pyatv.Protocol.AirPlay, pyatv.Protocol.MRP]:
                        try:
                            print(json.dumps({"debug": f"Trying protocol: {proto.name}"}))
                            sys.stdout.flush()
                            pairing = await pyatv.pair(device, proto, loop=loop)
                            protocol = proto
                            break
                        except Exception as e:
                            print(json.dumps({"debug": f"Protocol {proto.name} failed: {str(e)}"}))
                            sys.stdout.flush()
                            continue
                    
                    if not protocol:
                        raise Exception("No working protocol found for pairing")
                else:
                    pairing = await pyatv.pair(device, protocol, loop=loop)
                
                # Start the pairing process
                await pairing.begin()
                
                # Check if PIN is required
                if pairing.device_provides_pin:
                    # Save the pairing session state
                    session_data = {
                        'device_id': identifier,
                        'device_address': str(device.address),
                        'protocol': protocol.name,
                        'pairing_id': id(pairing),  # This won't work across processes
                        'timestamp': time.time()
                    }
                    
                    # We need to keep the pairing alive - let's try a different approach
                    # Instead of closing, we'll enter a loop waiting for the PIN
                    print(json.dumps({
                        "pairing": "waiting_for_pin",
                        "message": "Enter the PIN shown on your Apple TV",
                        "requires_pin": True,
                        "session_id": str(id(pairing)),
                        "note": "Use the 'submit-pin' command with the PIN"
                    }))
                    sys.stdout.flush()  # Ensure output is sent immediately
                    
                    # Keep the session alive and wait for PIN input via stdin
                    # This is a bit hacky but necessary for maintaining the session
                    
                    # Wait for PIN on stdin (this keeps the process and pairing session alive)
                    try:
                        # Debug output
                        print(json.dumps({"debug": "Waiting for PIN input on stdin"}))
                        sys.stdout.flush()
                        
                        pin_input = sys.stdin.readline().strip()
                        print(json.dumps({"debug": f"Received PIN: {pin_input}"}))
                        sys.stdout.flush()
                        
                        if pin_input:
                            pairing.pin(pin_input)
                            await pairing.finish()
                            
                            # Get the credentials directly from the pairing object
                            if identifier not in stored_credentials:
                                stored_credentials[identifier] = {}
                            
                            # Get the credentials from pairing
                            # The credentials should be available after finish()
                            credentials = None
                            
                            # Try different ways to get credentials
                            if hasattr(pairing, 'credentials'):
                                credentials = pairing.credentials
                                print(json.dumps({"debug": f"Found pairing.credentials"}))
                            elif hasattr(pairing, 'service') and hasattr(pairing.service, 'credentials'):
                                credentials = pairing.service.credentials
                                print(json.dumps({"debug": f"Found pairing.service.credentials"}))
                            
                            # If we found credentials, save them
                            if credentials:
                                stored_credentials[identifier][protocol.name.lower()] = credentials
                                print(json.dumps({"debug": f"Stored {protocol.name} credentials"}))
                            else:
                                print(json.dumps({"debug": "WARNING: No credentials found after pairing"}))
                            
                            sys.stdout.flush()
                            
                            await pairing.close()
                            
                            # Save to file
                            os.makedirs(os.path.dirname(credentials_file), exist_ok=True)
                            with open(credentials_file, "w") as f:
                                json.dump(stored_credentials, f, indent=2)
                            
                            print(json.dumps({"debug": f"Saved credentials to file: {credentials_file}"}))
                            sys.stdout.flush()
                            
                            print(json.dumps({
                                "pairing": "complete",
                                "message": "Pairing successful! Remote commands should now work."
                            }))
                        else:
                            print(json.dumps({"error": "No PIN provided"}))
                    except Exception as e:
                        print(json.dumps({"error": f"PIN submission failed: {str(e)}"}))
                    
                    await pairing.close()
                    sys.exit(0)
                else:
                    # Try to finish pairing without PIN
                    await pairing.finish()
                    
                    # Save credentials
                    if identifier not in stored_credentials:
                        stored_credentials[identifier] = {}
                    
                    # Get the credentials from the paired device
                    for service in device.services:
                        protocol = service.protocol
                        if service.credentials:
                            stored_credentials[identifier][protocol.name.lower()] = service.credentials
                    
                    # Save to file
                    os.makedirs(os.path.dirname(credentials_file), exist_ok=True)
                    with open(credentials_file, "w") as f:
                        json.dump(stored_credentials, f, indent=2)
                    
                    print(json.dumps({
                        "pairing": "complete", 
                        "message": "Pairing successful! Remote commands should now work."
                    }))
                    
                await pairing.close()
                
            except Exception as e:
                print(json.dumps({
                    "error": f"Pairing failed: {str(e)}",
                    "fallback": f"Try manual pairing: atvremote --id {identifier} pair"
                }))
        
        # The pair-with-pin command is no longer needed since we handle PIN submission via stdin in the pair command
        
        elif command == "status":
            # Connect to default device first
            identifier = controller.load_config()
            if identifier and await controller.connect(identifier):
                info = await controller.get_playing_info()
                await controller.disconnect()
                print(json.dumps(info))
            else:
                print(json.dumps({"error": "Not connected to any device"}))
        
        elif command == "verify-pairing":
            # Check if we're actually paired
            identifier = controller.load_config()
            if identifier:
                success = await controller.connect(identifier)
                if success:
                    # Try a simple command
                    result = await controller.send_command("menu")
                    await controller.disconnect()
                    
                    if result.get("success"):
                        print(json.dumps({
                            "paired": True,
                            "message": "Successfully paired! Remote commands are working."
                        }))
                    else:
                        print(json.dumps({
                            "paired": False,
                            "message": "Connection works but commands fail. Pairing may not be complete.",
                            "error": result.get("error", "Unknown error")
                        }))
                else:
                    print(json.dumps({
                        "paired": False,
                        "message": "Cannot connect to Apple TV"
                    }))
            else:
                print(json.dumps({"error": "No device configured"}))
        
        elif command == "test-connection":
            # Test if we can connect without pairing
            identifier = controller.load_config()
            if identifier:
                loop = asyncio.get_running_loop()
                devices = await pyatv.scan(loop, timeout=5)
                
                device = None
                for d in devices:
                    if str(d.identifier) == identifier:
                        device = d
                        break
                
                if device:
                    try:
                        # Try connecting without credentials
                        atv = await pyatv.connect(device, loop)
                        if atv:
                            # Test if remote control is available
                            if hasattr(atv, 'remote_control'):
                                print(json.dumps({
                                    "status": "connected",
                                    "message": "Connection successful! Remote may work without pairing.",
                                    "services": [s.protocol.name for s in device.services]
                                }))
                            else:
                                print(json.dumps({
                                    "status": "limited",
                                    "message": "Connected but remote control not available. Pairing required."
                                }))
                            atv.close()
                        else:
                            print(json.dumps({"status": "failed", "message": "Could not connect"}))
                    except Exception as e:
                        print(json.dumps({
                            "status": "error",
                            "message": str(e),
                            "hint": "Try pairing or check if Apple TV allows control without authentication"
                        }))
                else:
                    print(json.dumps({"error": "Device not found"}))
            else:
                print(json.dumps({"error": "No device configured"}))
        
        elif command in ["up", "down", "left", "right", "select", "menu", "home", "tv",
                        "play", "pause", "play_pause", "skip_forward", "skip_backward",
                        "volume_up", "volume_down", "suspend", "wakeup"]:
            # For now, we'll create a new connection for each command
            # In the future, we could implement a persistent connection service
            identifier = controller.load_config()
            if identifier:
                # Try to connect using stored identifier
                success = await controller.connect(identifier)
                if success:
                    result = await controller.send_command(command)
                    await controller.disconnect()
                    print(json.dumps(result))
                else:
                    print(json.dumps({"error": "Failed to connect to Apple TV. Make sure it's powered on."}))
            else:
                print(json.dumps({"error": "No device configured. Please select a device first."}))
        
        else:
            print(json.dumps({"error": f"Unknown command: {command}"}))
            
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())