#!/usr/bin/env bash

# AGS UI Setup Script
# This script installs all dependencies required for the AGS desktop shell

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
info() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Detect Linux distribution
detect_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        echo "$ID"
    else
        echo "unknown"
    fi
}

# Detect package manager
detect_package_manager() {
    if command -v apt-get &> /dev/null; then
        echo "apt"
    elif command -v dnf &> /dev/null; then
        echo "dnf"
    elif command -v pacman &> /dev/null; then
        echo "pacman"
    else
        echo "unknown"
    fi
}

DISTRO=$(detect_distro)
PKG_MANAGER=$(detect_package_manager)

info "Detected distribution: $DISTRO"
info "Detected package manager: $PKG_MANAGER"

# Install system packages based on distribution
install_system_packages() {
    info "Installing system packages..."
    
    case $PKG_MANAGER in
        apt)
            sudo apt update
            sudo apt install -y \
                gtk4 \
                gjs \
                libgtk-4-dev \
                libgtksourceview-5-dev \
                gtk4-layer-shell \
                network-manager \
                libnm-dev \
                bluez \
                wireplumber \
                libwireplumber-0.4-dev \
                pipewire \
                pipewire-pulse \
                libpipewire-0.3-dev \
                playerctl \
                pulseaudio-utils \
                brightnessctl \
                grim \
                slurp \
                wl-clipboard \
                curl \
                bc \
                libnotify-bin \
                libnotify-dev \
                ffmpeg \
                swaylock \
                fonts-noto-color-emoji \
                libayatana-appindicator3-dev \
                libdbusmenu-gtk3-dev \
                build-essential \
                cmake \
                meson \
                ninja-build \
                git \
                gobject-introspection \
                libgirepository1.0-dev
            ;;
        dnf)
            sudo dnf install -y \
                gtk4 \
                gjs \
                gtk4-devel \
                gtksourceview5-devel \
                gtk4-layer-shell \
                gtk4-layer-shell-devel \
                NetworkManager \
                NetworkManager-libnm-devel \
                bluez \
                wireplumber \
                wireplumber-devel \
                pipewire \
                pipewire-pulseaudio \
                pipewire-devel \
                playerctl \
                pulseaudio-utils \
                brightnessctl \
                grim \
                slurp \
                wl-clipboard \
                curl \
                bc \
                libnotify \
                libnotify-devel \
                libdbusmenu-devel \
                libdbusmenu-gtk3-devel \
                astal-gtk4-devel \
                ffmpeg \
                swaylock \
                google-noto-emoji-fonts \
                libappindicator-gtk3-devel \
                libdbusmenu-gtk3-devel \
                gcc \
                gcc-c++ \
                cmake \
                meson \
                ninja-build \
                git \
                gobject-introspection-devel
            ;;
        pacman)
            sudo pacman -Syu --noconfirm \
                gtk4 \
                gjs \
                gtksourceview5 \
                gtk4-layer-shell \
                networkmanager \
                libnm \
                bluez \
                bluez-utils \
                wireplumber \
                pipewire \
                pipewire-pulse \
                pipewire-jack \
                playerctl \
                brightnessctl \
                grim \
                slurp \
                wl-clipboard \
                curl \
                bc \
                libnotify \
                ffmpeg \
                swaylock \
                noto-fonts-emoji \
                libappindicator-gtk3 \
                libdbusmenu-gtk3 \
                base-devel \
                cmake \
                meson \
                ninja \
                git \
                gobject-introspection
            ;;
        *)
            error "Unsupported package manager. Please install dependencies manually."
            error "Supported package managers: apt (Debian/Ubuntu), dnf (Fedora), pacman (Arch)"
            exit 1
            ;;
    esac
    
    success "System packages installed"
}

# Install Hyprland if not present
install_hyprland() {
    if ! command -v Hyprland &> /dev/null; then
        warning "Hyprland not found. Installing..."
        
        case $PKG_MANAGER in
            apt)
                # Add Hyprland PPA or build from source
                warning "Hyprland needs to be built from source on Debian/Ubuntu"
                warning "Please visit: https://wiki.hyprland.org/Getting-Started/Installation/"
                ;;
            dnf)
                sudo dnf copr enable -y solopasha/hyprland
                sudo dnf install -y hyprland
                ;;
            pacman)
                sudo pacman -S --noconfirm hyprland
                ;;
        esac
    else
        success "Hyprland already installed"
    fi
}

# Install AGS/Astal
install_ags() {
    info "Installing AGS (Astal GTK Shell)..."
    
    if [ -d "/usr/share/astal/gjs" ]; then
        success "Astal already installed"
        return
    fi
    
    # Clone and build Astal
    TEMP_DIR=$(mktemp -d)
    cd "$TEMP_DIR"
    
    info "Cloning Astal repository..."
    git clone --recursive https://github.com/aylur/astal.git
    cd astal
    
    info "Building Astal with all features..."
    # Enable all optional features for complete functionality
    meson setup build \
        -Dtray=true \
        -Dbluetooth=true \
        -Dnetwork=true \
        -Dbattery=true \
        -Dwireplumber=true \
        -Dhyprland=true \
        -Dnotifd=true \
        -Dmpris=true \
        -Dpowerprofiles=true \
        -Dapps=true
    meson compile -C build
    sudo meson install -C build
    
    cd - > /dev/null
    rm -rf "$TEMP_DIR"
    
    success "AGS/Astal installed with all features"
}

# Install Bun
install_bun() {
    if ! command -v bun &> /dev/null; then
        info "Installing Bun..."
        curl -fsSL https://bun.sh/install | bash
        
        # Add to PATH for current session
        export BUN_INSTALL="$HOME/.bun"
        export PATH="$BUN_INSTALL/bin:$PATH"
        
        success "Bun installed"
    else
        success "Bun already installed"
    fi
}

# Install Node.js (as fallback)
install_nodejs() {
    if ! command -v node &> /dev/null; then
        info "Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
        
        case $PKG_MANAGER in
            apt)
                sudo apt install -y nodejs
                ;;
            dnf)
                sudo dnf install -y nodejs
                ;;
            pacman)
                sudo pacman -S --noconfirm nodejs npm
                ;;
        esac
        
        success "Node.js installed"
    else
        success "Node.js already installed"
    fi
}

# Install optional tools
install_optional_tools() {
    info "Installing optional tools..."
    
    # Clipboard history manager
    if ! command -v cliphist &> /dev/null; then
        warning "cliphist not found. Installing from source..."
        go install go.senan.xyz/cliphist@latest || warning "Failed to install cliphist. Go might not be installed."
    fi
    
    # Notification centers (install at least one)
    if ! command -v swaync &> /dev/null && ! command -v dunst &> /dev/null && ! command -v mako &> /dev/null; then
        case $PKG_MANAGER in
            apt)
                sudo apt install -y dunst
                ;;
            dnf)
                sudo dnf install -y dunst
                ;;
            pacman)
                sudo pacman -S --noconfirm dunst
                ;;
        esac
    fi
    
    # GTK theme manager
    if ! command -v nwg-look &> /dev/null; then
        case $PKG_MANAGER in
            pacman)
                yay -S --noconfirm nwg-look || warning "nwg-look installation failed"
                ;;
            *)
                warning "nwg-look not available in repositories. Install manually from: https://github.com/nwg-piotr/nwg-look"
                ;;
        esac
    fi
}

# Install project dependencies
install_project_dependencies() {
    info "Installing project dependencies..."
    
    # Ensure we're in the project directory
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
    cd "$SCRIPT_DIR"
    
    if [ -f "package.json" ]; then
        if command -v bun &> /dev/null; then
            info "Installing dependencies with Bun..."
            bun install
        elif command -v npm &> /dev/null; then
            info "Installing dependencies with npm..."
            npm install
        else
            error "Neither Bun nor npm found. Please install one of them first."
            exit 1
        fi
        
        success "Project dependencies installed"
    else
        error "package.json not found. Are you in the correct directory?"
        exit 1
    fi
}

# Setup environment
setup_environment() {
    info "Setting up environment..."
    
    # Create necessary directories
    mkdir -p "$HOME/.local/share/ags/logs"
    mkdir -p "$HOME/.local/bin"
    
    # Add environment variables to shell config
    SHELL_RC=""
    if [ -f "$HOME/.bashrc" ]; then
        SHELL_RC="$HOME/.bashrc"
    elif [ -f "$HOME/.zshrc" ]; then
        SHELL_RC="$HOME/.zshrc"
    fi
    
    if [ -n "$SHELL_RC" ]; then
        # Check if already added
        if ! grep -q "AGS Environment Variables" "$SHELL_RC"; then
            cat >> "$SHELL_RC" << 'EOF'

# AGS Environment Variables (AGS-specific only)
export AGS_LOG_LEVEL=info
export AGS_LOG_FORMAT=pretty
export AGS_LOG_CONSOLE=true

# Add Bun to PATH if not already there
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Ensure ~/.local/bin is in PATH
export PATH="$HOME/.local/bin:$PATH"
EOF
            info "Environment variables added to $SHELL_RC"
        fi
    fi
    
    # Copy AGS launcher script
    info "Installing AGS launcher wrapper..."
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
    
    if [ -f "$SCRIPT_DIR/ags-launcher.sh" ]; then
        cp "$SCRIPT_DIR/ags-launcher.sh" "$HOME/.local/bin/ags-launcher"
        chmod +x "$HOME/.local/bin/ags-launcher"
        success "AGS launcher installed to ~/.local/bin/ags-launcher"
    else
        error "ags-launcher.sh not found in $SCRIPT_DIR"
        warning "Please ensure ags-launcher.sh exists in the repository"
    fi
    
    success "Environment setup complete"
}

# Enable system services
enable_services() {
    info "Enabling system services..."
    
    # Enable Bluetooth
    sudo systemctl enable --now bluetooth.service || warning "Failed to enable Bluetooth service"
    
    # Enable NetworkManager
    sudo systemctl enable --now NetworkManager.service || warning "Failed to enable NetworkManager service"
    
    success "System services enabled"
}

# Verify Astal libraries installation
verify_astal_libraries() {
    info "Verifying Astal libraries installation..."
    
    local missing_libs=()
    
    # Check for required GIR files
    local gir_dirs=("/usr/share/gir-1.0" "/usr/local/share/gir-1.0")
    local required_girs=(
        "AstalBluetooth"
        "AstalHyprland"
        "AstalNetwork"
        "AstalNotifd"
        "AstalTray"
        "AstalWp"
        "AstalBattery"
        "AstalMpris"
        "AstalApps"
        "AstalPowerProfiles"
    )
    
    for gir in "${required_girs[@]}"; do
        local found=false
        for dir in "${gir_dirs[@]}"; do
            if [ -f "$dir/$gir-0.1.gir" ]; then
                found=true
                break
            fi
        done
        if [ "$found" = false ]; then
            missing_libs+=("$gir")
        fi
    done
    
    if [ ${#missing_libs[@]} -gt 0 ]; then
        warning "Missing Astal libraries: ${missing_libs[*]}"
        warning "You may need to rebuild Astal with all features enabled"
    else
        success "All Astal libraries verified"
    fi
}

# Build the project
build_project() {
    info "Building the project..."
    
    SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
    cd "$SCRIPT_DIR"
    
    if command -v bun &> /dev/null; then
        bun run build:app
    elif command -v npm &> /dev/null; then
        npm run build:app
    else
        error "No package manager found to build the project"
        exit 1
    fi
    
    success "Project built successfully"
}

# Main installation flow
main() {
    echo "====================================="
    echo "    AGS UI Installation Script"
    echo "====================================="
    echo ""
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        error "Please do not run this script as root. It will ask for sudo when needed."
        exit 1
    fi
    
    # Installation steps
    install_system_packages
    install_hyprland
    install_ags
    verify_astal_libraries
    install_bun
    install_nodejs
    install_optional_tools
    install_project_dependencies
    setup_environment
    enable_services
    build_project
    
    echo ""
    echo "====================================="
    success "Installation complete!"
    echo ""
    info "Next steps:"
    echo "  1. Log out and log back in to ensure environment variables are loaded"
    echo "  2. Start Hyprland if not already running"
    echo "  3. Run 'ags-launcher' to launch AGS (or 'bun start:app' for development)"
    echo "  4. For development, use 'bun dev:watch' for hot reload"
    echo ""
    info "Note: The 'ags-launcher' wrapper sets GTK-specific environment variables"
    echo "      only for AGS, preventing conflicts with other GTK applications."
    echo ""
    warning "Optional: Set up AI API keys in your environment:"
    echo "  - CLAUDE_API_KEY"
    echo "  - OPENAI_API_KEY"
    echo "  - GOOGLE_API_KEY"
    echo ""
    info "For more information, see the README.md file"
    echo "====================================="
}

# Run main function
main "$@"
