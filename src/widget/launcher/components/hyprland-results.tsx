import { launcherLogger as log } from "../../../utils/logger";
import HyprlandButton from "../buttons/hyprland-button";
import { createLogger } from "../../../utils/logger";
import { execAsync } from "astal/process";
import windowManager from "../../../services/window-manager";
import GLib from "gi://GLib";

const logger = createLogger("HyprlandResults");

export interface HyprlandClient {
  address: string;
  mapped: boolean;
  hidden: boolean;
  at: [number, number];
  size: [number, number];
  workspace: {
    id: number;
    name: string;
  };
  floating: boolean;
  monitor: number;
  class: string;
  title: string;
  initialClass: string;
  initialTitle: string;
  pid: number;
  xwayland: boolean;
  pinned: boolean;
  fullscreen: boolean;
  fullscreenMode: number;
  fakeFullscreen: boolean;
  grouped: any[];
  swallowing: string;
  focusHistoryID: number;
}

export interface HyprlandWindowResult {
  client: HyprlandClient;
  index: number;
  window: HyprlandClient;
  screenshotPath?: string | null;
}

// Get all Hyprland windows/clients
async function getHyprlandClients(): Promise<HyprlandClient[]> {
  try {
    const result = await execAsync(["hyprctl", "clients", "-j"]);
    const clients = JSON.parse(result) as HyprlandClient[];
    logger.debug("Got Hyprland clients", { count: clients.length });
    return clients;
  } catch (error) {
    logger.error("Failed to get Hyprland clients", { error });
    return [];
  }
}

// Filter clients based on search query
function filterClients(clients: HyprlandClient[], query: string): HyprlandClient[] {
  if (!query || query.length === 0) {
    return clients;
  }

  const lowerQuery = query.toLowerCase();
  return clients.filter(client => {
    // Search in class name, title, and initial class/title
    return (
      client.class.toLowerCase().includes(lowerQuery) ||
      client.title.toLowerCase().includes(lowerQuery) ||
      client.initialClass.toLowerCase().includes(lowerQuery) ||
      client.initialTitle.toLowerCase().includes(lowerQuery)
    );
  });
}

export default async function getHyprlandResults(searchText: string): Promise<HyprlandWindowResult[]> {
  logger.debug("Getting Hyprland window results", { searchText });

  const clients = await getHyprlandClients();
  const filteredClients = filterClients(clients, searchText);

  // Sort by focus history ID (lower is more recent)
  const sortedClients = filteredClients.sort((a, b) => a.focusHistoryID - b.focusHistoryID);

  return sortedClients.map((client, index) => {
    // Get window screenshot path if available
    const normalizedAddress = client.address.startsWith("0x") ? client.address : `0x${client.address}`;
    const screenshotPath = windowManager.getWindowScreenshot(normalizedAddress);
    const validPath = screenshotPath && GLib.file_test(screenshotPath, GLib.FileTest.EXISTS) ? screenshotPath : null;

    return {
      client,
      index,
      window: client,
      screenshotPath: validPath
    };
  });
}

// Export a function to create the Hyprland window button
export function createHyprlandButton(result: HyprlandWindowResult, props: any) {
  // Import dynamically to avoid circular dependency
  // Don't override the index from props - it contains the correct adjusted index
  return <HyprlandButton
    client={result.client}
    index={result.index}
    {...props} />;
}
