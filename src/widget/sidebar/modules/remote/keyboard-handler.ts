import { Gtk, Gdk } from "astal/gtk4";
import { sidebarLogger as log } from "../../../../utils/logger";

export interface RemoteKeyboardHandlerProps {
    isConnected: boolean;
    onCommand: (command: string) => Promise<void>;
}

export function setupRemoteKeyboardHandler(
    window: Gtk.Window,
    props: RemoteKeyboardHandlerProps
): Gtk.EventControllerKey {
    const keyController = new Gtk.EventControllerKey();
    
    keyController.connect('key-pressed', (_controller, keyval, _keycode, state) => {
        // Only handle keys when connected
        if (!props.isConnected) {
            return false;
        }

        // Check modifier keys
        const shiftPressed = (state & Gdk.ModifierType.SHIFT_MASK) !== 0;
        const superPressed = (state & Gdk.ModifierType.SUPER_MASK) !== 0;

        log.debug("Remote key pressed", { keyval, state, shift: shiftPressed, super: superPressed });

        // Handle Super + key combinations first
        if (superPressed) {
            switch (keyval) {
                case Gdk.KEY_Super_L:
                case Gdk.KEY_Super_R:
                    // Home key
                    props.onCommand("home");
                    return true;
            }
        }

        // Handle Shift + key combinations
        if (shiftPressed) {
            switch (keyval) {
                case Gdk.KEY_h:
                case Gdk.KEY_H:
                    // Previous track
                    props.onCommand("skip_backward");
                    return true;
                case Gdk.KEY_l:
                case Gdk.KEY_L:
                    // Next track
                    props.onCommand("skip_forward");
                    return true;
            }
        }

        // Handle regular keys (no shift)
        switch (keyval) {
            // Vim navigation keys
            case Gdk.KEY_h:
                if (!shiftPressed) {
                    props.onCommand("left");
                    return true;
                }
                break;
            case Gdk.KEY_j:
                props.onCommand("down");
                return true;
            case Gdk.KEY_k:
                props.onCommand("up");
                return true;
            case Gdk.KEY_l:
                if (!shiftPressed) {
                    props.onCommand("right");
                    return true;
                }
                break;

            // Playback controls
            case Gdk.KEY_space:
                props.onCommand("play_pause");
                return true;

            // Navigation controls
            case Gdk.KEY_Return:
            case Gdk.KEY_KP_Enter:
                props.onCommand("select");
                return true;

            case Gdk.KEY_BackSpace:
                props.onCommand("menu");
                return true;

            // Volume controls
            case Gdk.KEY_AudioRaiseVolume:
            case Gdk.KEY_XF86AudioRaiseVolume:
                props.onCommand("volume_up");
                return true;

            case Gdk.KEY_AudioLowerVolume:
            case Gdk.KEY_XF86AudioLowerVolume:
                props.onCommand("volume_down");
                return true;

            // Additional media keys
            case Gdk.KEY_AudioPlay:
            case Gdk.KEY_XF86AudioPlay:
            case Gdk.KEY_AudioPause:
            case Gdk.KEY_XF86AudioPause:
                props.onCommand("play_pause");
                return true;

            case Gdk.KEY_AudioNext:
            case Gdk.KEY_XF86AudioNext:
                props.onCommand("skip_forward");
                return true;

            case Gdk.KEY_AudioPrev:
            case Gdk.KEY_XF86AudioPrev:
                props.onCommand("skip_backward");
                return true;
        }

        return false;
    });

    window.add_controller(keyController);
    return keyController;
}

// Helper function to remove keyboard handler
export function removeRemoteKeyboardHandler(
    window: Gtk.Window,
    controller: Gtk.EventControllerKey
): void {
    window.remove_controller(controller);
}