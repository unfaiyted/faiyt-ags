import { Variable, bind } from "astal";
import { Gtk, Gdk } from "astal/gtk4";
import { serviceLogger as log } from "../../../utils/logger";
import { 
  keybindFromEvent, 
  keybindToString, 
  parseKeybind, 
  isValidKeybind,
  Keybind 
} from "../../../utils/keybind";

interface KeybindInputProps {
  value: string;
  onChanged: (value: string) => void;
  placeholder?: string;
}

export const KeybindInput = ({
  value,
  onChanged,
  placeholder = "Press keys..."
}: KeybindInputProps) => {
  const isRecording = Variable(false);
  const currentKeybind = Variable<Keybind>(parseKeybind(value));
  const displayText = Variable(value || placeholder);

  const startRecording = () => {
    isRecording.set(true);
    currentKeybind.set({ modifiers: [], key: "" });
    displayText.set("Recording...");
    log.debug("Started recording keybind");
  };

  const stopRecording = () => {
    isRecording.set(false);
    const kb = currentKeybind.get();
    
    if (isValidKeybind(kb)) {
      const keybindStr = keybindToString(kb);
      displayText.set(keybindStr);
      onChanged(keybindStr);
      log.debug(`Recorded keybind: ${keybindStr}`);
    } else {
      displayText.set(value || placeholder);
      log.debug("Invalid keybind, reverting");
    }
  };

  const handleKeyPress = (keyval: number, state: Gdk.ModifierType) => {
    if (!isRecording.get()) return false;

    const kb = keybindFromEvent(keyval, state);
    currentKeybind.set(kb);
    
    // Update display text while recording
    if (kb.key || kb.modifiers.length > 0) {
      const str = keybindToString(kb);
      displayText.set(str || "Recording...");
    }

    // If we have a complete keybind (key + modifiers or just a special key), stop recording
    if (kb.key && kb.key !== "") {
      stopRecording();
    }

    return true; // Consume the event
  };

  const handleKeyRelease = () => {
    // Check if we only have modifiers and no key
    const kb = currentKeybind.get();
    if (isRecording.get() && kb.modifiers.length > 0 && !kb.key) {
      // User released keys without pressing a non-modifier
      stopRecording();
    }
  };

  return (
    <box cssName="keybind-input-wrapper" spacing={8}>
      <button
        cssName="keybind-input"
        cssClasses={bind(isRecording).as(recording => recording ? ["recording"] : [])}
        onClicked={startRecording}
        canFocus={true}
        sensitive={true}
        onKeyPressed={(_, keyval, __, state) => handleKeyPress(keyval, state)}
        onKeyReleased={handleKeyRelease}
        setup={(self) => {
          // Focus when recording starts
          isRecording.subscribe((recording) => {
            if (recording) {
              self.grab_focus();
            }
          });
          
          // Handle focus loss using GTK4 focus controller
          const focusController = new Gtk.EventControllerFocus();
          focusController.connect("leave", () => {
            if (isRecording.get()) {
              stopRecording();
            }
          });
          self.add_controller(focusController);
        }}
      >
        <label label={bind(displayText)} />
      </button>
      
      {bind(isRecording).as(recording => recording ? (
        <button
          cssName="keybind-cancel"
          onClicked={stopRecording}
          tooltip_text="Cancel recording"
        >
          <label>✕</label>
        </button>
      ) : value ? (
        <button
          cssName="keybind-clear"
          onClicked={() => {
            displayText.set(placeholder);
            onChanged("");
          }}
          tooltip_text="Clear keybind"
        >
          <label>🗑</label>
        </button>
      ) : <box />)}
    </box>
  );
};