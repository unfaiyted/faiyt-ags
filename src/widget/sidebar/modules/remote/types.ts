export interface AppleTV {
    name: string;
    address: string;
    identifier: string;
    services: string[];
}

export interface PlayingInfo {
    title: string;
    artist: string;
    album: string;
    genre: string;
    total_time: number;
    position: number;
    repeat: string;
    shuffle: string;
    device_state: string;
    power_state: string;
}

export interface RemoteState {
    devices: AppleTV[];
    selectedDevice: AppleTV | null;
    isConnected: boolean;
    isLoading: boolean;
    playingInfo: PlayingInfo | null;
    error: string | null;
    showManualAdd: boolean;
    manualIP: string;
    pairingStatus: string | null;
    showPinEntry: boolean;
    pairingPin: string;
    pairingInProgress: boolean;
}