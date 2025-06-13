import { actions } from "../../../../utils/actions";
import { Variable, bind } from "astal";
import { NetworkIndicator } from "./indicators";
import { ToggleIcon } from "./toggle-icon";
import { barLogger as log } from "../../../../utils/logger";

export const NetworkToggle = () => {
  const tooltipText = Variable("Wifi | Right-Click to configure");

  return (
    <ToggleIcon
      tooltipText={bind(tooltipText)}
      handleClick={() => {
        log.info("Toggling WiFi");
        actions.network.toggleWifi();
      }}
      handleRightClick={actions.app.wifi}
      indicator={() => <NetworkIndicator />}
      active={bind(actions.network.getWifiEnabled())}
      label="Wi-Fi"
    />
  );
};

export default NetworkToggle;
