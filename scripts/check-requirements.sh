#!/bin/bash

# AGS Requirements Checker
# This script checks if all required dependencies are installed

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Exit codes
EXIT_SUCCESS=0
EXIT_MISSING_REQUIRED=1
EXIT_MISSING_OPTIONAL=2

# Track status
MISSING_REQUIRED=()
MISSING_OPTIONAL=()
WARNINGS=()

# Logging functions
info() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[✓]${NC} $1"; }
warning() { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; }

# Check if a command exists
check_command() {
    local cmd=$1
    local description=$2
    local required=${3:-true}
    
    if command -v "$cmd" &> /dev/null; then
        success "$description: $cmd"
        return 0
    else
        if [ "$required" == "true" ]; then
            error "$description: $cmd (REQUIRED)"
            MISSING_REQUIRED+=("$cmd - $description")
        else
            warning "$description: $cmd (optional)"
            MISSING_OPTIONAL+=("$cmd - $description")
        fi
        return 1
    fi
}

# Check if a library file exists
check_library() {
    local lib_name=$1
    local description=$2
    local required=${3:-true}
    local paths=("/usr/lib" "/usr/lib64" "/usr/local/lib" "/usr/local/lib64")
    
    for path in "${paths[@]}"; do
        if [ -f "$path/$lib_name" ]; then
            success "$description: Found in $path"
            return 0
        fi
    done
    
    if [ "$required" == "true" ]; then
        error "$description: $lib_name not found (REQUIRED)"
        MISSING_REQUIRED+=("$lib_name - $description")
    else
        warning "$description: $lib_name not found (optional)"
        MISSING_OPTIONAL+=("$lib_name - $description")
    fi
    return 1
}

# Check if a GIR file exists
check_gir() {
    local gir_name=$1
    local required=${2:-true}
    local gir_dirs=("/usr/share/gir-1.0" "/usr/local/share/gir-1.0")
    
    for dir in "${gir_dirs[@]}"; do
        if [ -f "$dir/${gir_name}-0.1.gir" ]; then
            success "GIR file: $gir_name"
            return 0
        fi
    done
    
    if [ "$required" == "true" ]; then
        error "GIR file: $gir_name (REQUIRED)"
        MISSING_REQUIRED+=("${gir_name}.gir - Astal library")
    else
        warning "GIR file: $gir_name (optional)"
        MISSING_OPTIONAL+=("${gir_name}.gir - Astal library")
    fi
    return 1
}

# Check if a package is installed (generic)
check_package_installed() {
    local package=$1
    local description=$2
    local required=${3:-true}
    
    # Try different package managers
    local installed=false
    
    if command -v dpkg &> /dev/null; then
        if dpkg -l | grep -q "^ii.*$package"; then
            installed=true
        fi
    elif command -v rpm &> /dev/null; then
        if rpm -q "$package" &> /dev/null; then
            installed=true
        fi
    elif command -v pacman &> /dev/null; then
        if pacman -Q "$package" &> /dev/null 2>&1; then
            installed=true
        fi
    fi
    
    if [ "$installed" == "true" ]; then
        success "$description: $package"
        return 0
    else
        if [ "$required" == "true" ]; then
            error "$description: $package (REQUIRED)"
            MISSING_REQUIRED+=("$package - $description")
        else
            warning "$description: $package (optional)"
            MISSING_OPTIONAL+=("$package - $description")
        fi
        return 1
    fi
}

# Check Node/Bun setup
check_node_setup() {
    local has_bun=false
    local has_npm=false
    
    if command -v bun &> /dev/null; then
        success "Package manager: Bun $(bun --version)"
        has_bun=true
    fi
    
    if command -v npm &> /dev/null; then
        success "Package manager: npm $(npm --version)"
        has_npm=true
    fi
    
    if [ "$has_bun" == "false" ] && [ "$has_npm" == "false" ]; then
        error "Package manager: Neither Bun nor npm found (REQUIRED)"
        MISSING_REQUIRED+=("bun or npm - Package manager")
        return 1
    fi
    
    # Check if dependencies are installed
    if [ -d "node_modules" ]; then
        success "Project dependencies: Installed"
    else
        warning "Project dependencies: Not installed (run 'bun install' or 'npm install')"
        WARNINGS+=("Project dependencies not installed")
    fi
    
    # Check if project is built
    if [ -f "dist/app.js" ]; then
        success "Project build: Found dist/app.js"
    else
        warning "Project build: dist/app.js not found (run 'bun build:app')"
        WARNINGS+=("Project not built")
    fi
    
    return 0
}

# Main checks
echo "====================================="
echo "    AGS Requirements Checker"
echo "====================================="
echo ""

info "Checking core requirements..."
echo ""

# Core binaries
info "Checking core binaries..."
check_command "ags" "AGS (Astal GTK Shell)" true
check_command "gjs" "GNOME JavaScript runtime" true
check_command "gtk4-launch" "GTK4 runtime" true

echo ""
info "Checking system services..."
check_command "systemctl" "SystemD" true
check_command "NetworkManager" "Network Manager daemon" true
check_command "bluetoothctl" "Bluetooth control" true

echo ""
info "Checking libraries..."
check_library "libgtk4-layer-shell.so" "GTK4 Layer Shell" true
check_library "libgtksourceview-5.so.0" "GTK Source View 5" true
check_library "libnotify.so.4" "Libnotify" true

echo ""
info "Checking Astal GIR files..."
check_gir "AstalBluetooth" true
check_gir "AstalHyprland" true
check_gir "AstalNetwork" true
check_gir "AstalNotifd" true
check_gir "AstalTray" true
check_gir "AstalWp" true
check_gir "AstalBattery" false
check_gir "AstalMpris" false
check_gir "AstalApps" false
check_gir "AstalPowerProfiles" false

echo ""
info "Checking audio/video tools..."
check_command "wpctl" "WirePlumber control" true
check_command "pactl" "PulseAudio control" false
check_command "playerctl" "Media player control" false
check_command "amixer" "ALSA mixer" false

echo ""
info "Checking system tools..."
check_command "brightnessctl" "Brightness control" false
check_command "hyprctl" "Hyprland control" false
check_command "hyprlock" "Hyprland screen locker" false
check_command "hyprpicker" "Color picker" false
check_command "curl" "HTTP client" true
check_command "bc" "Calculator" false
check_command "uptime" "System uptime" true
check_command "rfkill" "RF device control" false

echo ""
info "Checking screenshot/recording tools..."
check_command "grim" "Screenshot tool" false
check_command "slurp" "Region selector" false
check_command "wf-recorder" "Screen recorder" false
check_command "ffmpeg" "Video encoder" false
check_command "ffprobe" "Media analyzer" false
check_command "wl-copy" "Wayland clipboard" false
check_command "wl-paste" "Wayland clipboard" false

echo ""
info "Checking process management tools..."
check_command "pgrep" "Process grep" false
check_command "pkill" "Process kill" false
check_command "killall" "Kill by name" false

echo ""
info "Checking data processing tools..."
check_command "jq" "JSON processor" false
check_command "socat" "Socket tool" false

echo ""
info "Checking optional tools..."
check_command "flatpak" "Flatpak applications" false
check_command "cliphist" "Clipboard history" false
check_command "notify-send" "Notification sender" false
check_command "dunst" "Notification daemon" false
check_command "swaync" "SwayNotificationCenter" false
check_command "mako" "Mako notification daemon" false
check_command "nwg-look" "GTK theme manager" false
check_command "swaylock" "Screen locker" false

echo ""
info "Checking build environment..."
check_node_setup

echo ""
echo "====================================="
echo "         Summary"
echo "====================================="
echo ""

# Determine exit status
EXIT_CODE=$EXIT_SUCCESS

# Report missing required dependencies
if [ ${#MISSING_REQUIRED[@]} -gt 0 ]; then
    error "Missing REQUIRED dependencies:"
    for dep in "${MISSING_REQUIRED[@]}"; do
        echo "  - $dep"
    done
    echo ""
    EXIT_CODE=$EXIT_MISSING_REQUIRED
fi

# Report missing optional dependencies
if [ ${#MISSING_OPTIONAL[@]} -gt 0 ]; then
    warning "Missing optional dependencies:"
    for dep in "${MISSING_OPTIONAL[@]}"; do
        echo "  - $dep"
    done
    echo ""
    if [ $EXIT_CODE -eq $EXIT_SUCCESS ]; then
        EXIT_CODE=$EXIT_MISSING_OPTIONAL
    fi
fi

# Report warnings
if [ ${#WARNINGS[@]} -gt 0 ]; then
    warning "Warnings:"
    for warn in "${WARNINGS[@]}"; do
        echo "  - $warn"
    done
    echo ""
fi

# Final status
if [ $EXIT_CODE -eq $EXIT_SUCCESS ]; then
    success "All required dependencies are installed!"
    info "AGS should run without issues."
elif [ $EXIT_CODE -eq $EXIT_MISSING_OPTIONAL ]; then
    warning "All required dependencies are installed, but some optional features may not work."
    info "Run './setup.sh' to install missing dependencies."
else
    error "Missing required dependencies! AGS will not run properly."
    info "Run './setup.sh' to install missing dependencies."
fi

echo "====================================="
echo ""

exit $EXIT_CODE