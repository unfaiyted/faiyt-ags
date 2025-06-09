import { Variable } from "astal";
import { serviceLogger as log } from "../utils/logger";

class LauncherState {
  private static instance: LauncherState;
  private _initialText = Variable("");

  private constructor() {}

  static getInstance(): LauncherState {
    if (!LauncherState.instance) {
      LauncherState.instance = new LauncherState();
    }
    return LauncherState.instance;
  }

  get initialText() {
    return this._initialText;
  }

  setInitialText(text: string) {
    log.debug("Setting launcher initial text", { text });
    this._initialText.set(text);
  }

  clearInitialText() {
    log.debug("Clearing launcher initial text");
    this._initialText.set("");
  }
}

export default LauncherState.getInstance();