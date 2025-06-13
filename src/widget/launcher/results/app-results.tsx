import { Gtk } from "astal/gtk4";
import AppButton from "../buttons/app-button";
import CustomAppButton from "../buttons/custom-app-button";
import Apps from "gi://AstalApps";
import { Variable, Binding } from "astal";
import desktopScanner, { DesktopEntry } from "../../../services/desktop-scanner";

const apps = new Apps.Apps({});

export interface AppButtonResult {
  app?: Apps.Application;
  customEntry?: DesktopEntry;
  index: number;
}

// Helper to check if a desktop entry is already in AstalApps
function isInAstalApps(entry: DesktopEntry, astalApps: Apps.Application[]): boolean {
  const entryName = entry.name.toLowerCase();
  const entryExec = entry.exec.split("/").pop()?.toLowerCase() || "";
  
  return astalApps.some(app => {
    const appName = app.name?.toLowerCase() || "";
    const appExec = app.executable?.toLowerCase() || "";
    
    // Check if names match or executables match
    return appName === entryName || 
           (appExec && entryExec && appExec.includes(entryExec)) ||
           (appExec && entryExec && entryExec.includes(appExec));
  });
}

export default function getAppResults(searchText: string): AppButtonResult[] {
  // Get results from AstalApps
  const astalResults = apps.fuzzy_query(searchText);
  const astalAppResults: AppButtonResult[] = astalResults
    .slice(0, 5)
    .map((app, index) => ({ app, index }));

  // Get results from our custom scanner
  const customResults = desktopScanner.fuzzySearch(searchText);
  
  // Filter out duplicates - only include custom entries not already in AstalApps
  const uniqueCustomResults = customResults.filter(entry => 
    !isInAstalApps(entry, astalResults)
  );

  const customAppResults: AppButtonResult[] = uniqueCustomResults
    .slice(0, 5)
    .map((entry, index) => ({ 
      customEntry: entry, 
      index: astalAppResults.length + index 
    }));

  // Combine results, prioritizing AstalApps results
  const combinedResults = [...astalAppResults, ...customAppResults];
  
  // Limit total results
  return combinedResults.slice(0, 10);
}

// Export a function to create the appropriate button component
export function createAppButton(result: AppButtonResult, props: any) {
  if (result.app) {
    return <AppButton app={result.app} index={result.index} {...props} />;
  } else if (result.customEntry) {
    return <CustomAppButton entry={result.customEntry} index={result.index} {...props} />;
  }
  return null;
}


