#!/usr/bin/env gjs

imports.gi.versions.GLib = '2.0';
const GLib = imports.gi.GLib;

// Log a message to verify GJS is working
print("GJS is working properly!");

// Check if Astal module is available
try {
    const Astal = imports.gi.Astal;
    print("Astal module loaded successfully!");
} catch(e) {
    print("Error loading Astal module: " + e.message);
}

// Finish with a success message
print("Test complete!");