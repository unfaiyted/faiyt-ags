import { Gdk } from "astal/gtk4";

// Map of key values to their string representations
const KEY_MAP: Record<number, string> = {
  [Gdk.KEY_Control_L]: "Ctrl",
  [Gdk.KEY_Control_R]: "Ctrl",
  [Gdk.KEY_Shift_L]: "Shift",
  [Gdk.KEY_Shift_R]: "Shift",
  [Gdk.KEY_Alt_L]: "Alt",
  [Gdk.KEY_Alt_R]: "Alt",
  [Gdk.KEY_Super_L]: "Super",
  [Gdk.KEY_Super_R]: "Super",
  [Gdk.KEY_Meta_L]: "Meta",
  [Gdk.KEY_Meta_R]: "Meta",
  [Gdk.KEY_Escape]: "Escape",
  [Gdk.KEY_Tab]: "Tab",
  [Gdk.KEY_Return]: "Return",
  [Gdk.KEY_space]: "Space",
  [Gdk.KEY_BackSpace]: "BackSpace",
  [Gdk.KEY_Delete]: "Delete",
  [Gdk.KEY_Home]: "Home",
  [Gdk.KEY_End]: "End",
  [Gdk.KEY_Page_Up]: "Page_Up",
  [Gdk.KEY_Page_Down]: "Page_Down",
  [Gdk.KEY_Up]: "Up",
  [Gdk.KEY_Down]: "Down",
  [Gdk.KEY_Left]: "Left",
  [Gdk.KEY_Right]: "Right",
  [Gdk.KEY_F1]: "F1",
  [Gdk.KEY_F2]: "F2",
  [Gdk.KEY_F3]: "F3",
  [Gdk.KEY_F4]: "F4",
  [Gdk.KEY_F5]: "F5",
  [Gdk.KEY_F6]: "F6",
  [Gdk.KEY_F7]: "F7",
  [Gdk.KEY_F8]: "F8",
  [Gdk.KEY_F9]: "F9",
  [Gdk.KEY_F10]: "F10",
  [Gdk.KEY_F11]: "F11",
  [Gdk.KEY_F12]: "F12",
  [Gdk.KEY_Insert]: "Insert",
  [Gdk.KEY_Menu]: "Menu",
  [Gdk.KEY_Caps_Lock]: "Caps_Lock",
  [Gdk.KEY_Num_Lock]: "Num_Lock",
  [Gdk.KEY_Scroll_Lock]: "Scroll_Lock",
  [Gdk.KEY_Print]: "Print",
  [Gdk.KEY_Pause]: "Pause",
  [Gdk.KEY_Break]: "Break",
};

// Modifier keys that should be captured
const MODIFIER_KEYS = new Set([
  Gdk.KEY_Control_L,
  Gdk.KEY_Control_R,
  Gdk.KEY_Shift_L,
  Gdk.KEY_Shift_R,
  Gdk.KEY_Alt_L,
  Gdk.KEY_Alt_R,
  Gdk.KEY_Super_L,
  Gdk.KEY_Super_R,
  Gdk.KEY_Meta_L,
  Gdk.KEY_Meta_R,
]);

export interface Keybind {
  modifiers: string[];
  key: string;
}

/**
 * Convert GDK key value to string representation
 */
export function keyvalToString(keyval: number): string {
  // Check if it's in our key map
  if (KEY_MAP[keyval]) {
    return KEY_MAP[keyval];
  }

  // Convert keyval to string
  const keyName = Gdk.keyval_name(keyval);
  if (!keyName) return "";

  // For single characters, return uppercase
  if (keyName.length === 1) {
    return keyName.toUpperCase();
  }

  // For other keys, return as-is
  return keyName;
}

/**
 * Parse modifier state into array of modifier names
 */
export function parseModifiers(state: Gdk.ModifierType): string[] {
  const modifiers: string[] = [];

  if (state & Gdk.ModifierType.CONTROL_MASK) {
    modifiers.push("Ctrl");
  }
  if (state & Gdk.ModifierType.SHIFT_MASK) {
    modifiers.push("Shift");
  }
  if (state & Gdk.ModifierType.ALT_MASK) {
    modifiers.push("Alt");
  }
  if (state & Gdk.ModifierType.SUPER_MASK) {
    modifiers.push("Super");
  }
  if (state & Gdk.ModifierType.META_MASK) {
    modifiers.push("Meta");
  }

  return modifiers;
}

/**
 * Convert keybind to string representation (e.g., "Ctrl+Alt+T")
 */
export function keybindToString(keybind: Keybind): string {
  if (!keybind.key) return "";
  
  const parts = [...keybind.modifiers];
  if (keybind.key && !MODIFIER_KEYS.has(Gdk.keyval_from_name(keybind.key))) {
    parts.push(keybind.key);
  }
  
  return parts.join("+");
}

/**
 * Parse string keybind to Keybind object (e.g., "Ctrl+Alt+T" -> {modifiers: ["Ctrl", "Alt"], key: "T"})
 */
export function parseKeybind(keybindStr: string): Keybind {
  const parts = keybindStr.split("+").map(p => p.trim()).filter(p => p);
  const modifiers: string[] = [];
  let key = "";

  const modifierNames = new Set(["Ctrl", "Control", "Shift", "Alt", "Super", "Meta", "Mod4"]);

  for (const part of parts) {
    // Normalize modifier names
    let normalizedPart = part;
    if (part === "Control") normalizedPart = "Ctrl";
    if (part === "Mod4") normalizedPart = "Super";

    if (modifierNames.has(part) || modifierNames.has(normalizedPart)) {
      modifiers.push(normalizedPart);
    } else {
      key = part;
    }
  }

  return { modifiers, key };
}

/**
 * Check if a keyval is a modifier key
 */
export function isModifierKey(keyval: number): boolean {
  return MODIFIER_KEYS.has(keyval);
}

/**
 * Create keybind from key event
 */
export function keybindFromEvent(keyval: number, state: Gdk.ModifierType): Keybind {
  const modifiers = parseModifiers(state);
  const key = isModifierKey(keyval) ? "" : keyvalToString(keyval);
  
  return { modifiers, key };
}

/**
 * Compare two keybinds for equality
 */
export function keybindsEqual(a: Keybind, b: Keybind): boolean {
  if (a.key !== b.key) return false;
  if (a.modifiers.length !== b.modifiers.length) return false;
  
  const aMods = new Set(a.modifiers);
  const bMods = new Set(b.modifiers);
  
  for (const mod of aMods) {
    if (!bMods.has(mod)) return false;
  }
  
  return true;
}

/**
 * Validate if a keybind is valid (has at least a key or is a complete modifier combo)
 */
export function isValidKeybind(keybind: Keybind): boolean {
  return keybind.key !== "" || keybind.modifiers.length > 1;
}