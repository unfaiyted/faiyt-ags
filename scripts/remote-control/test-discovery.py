#!/usr/bin/env python3
import asyncio
import pyatv
import json

async def test_discovery():
    print("Starting Apple TV discovery...")
    print("Scanning for 10 seconds...")
    
    # Try with longer timeout
    devices = await pyatv.scan(timeout=10)
    
    if not devices:
        print("No devices found.")
        print("\nPossible reasons:")
        print("1. Apple TV is on a different network/VLAN")
        print("2. Firewall is blocking mDNS (port 5353)")
        print("3. Apple TV is in sleep mode")
        print("4. Network doesn't support multicast")
    else:
        print(f"\nFound {len(devices)} device(s):")
        for device in devices:
            print(f"\nDevice: {device.name}")
            print(f"  Address: {device.address}")
            print(f"  ID: {device.identifier}")
            print(f"  Services: {[s.name for s in device.services]}")
    
    # Also try to find specific services
    print("\n\nLooking for specific mDNS services...")
    from zeroconf import ServiceBrowser, Zeroconf
    
    zeroconf = Zeroconf()
    services = []
    
    def on_service_state_change(zeroconf, service_type, name, state_change):
        if "apple" in name.lower() or "airplay" in name.lower():
            services.append(name)
    
    browser = ServiceBrowser(zeroconf, ["_airplay._tcp.local.", "_companion-link._tcp.local.", "_mediaremotetv._tcp.local."], handlers=[on_service_state_change])
    
    await asyncio.sleep(3)
    browser.cancel()
    zeroconf.close()
    
    if services:
        print(f"Found Apple-related services: {services}")

if __name__ == "__main__":
    asyncio.run(test_discovery())