import { Gtk } from "astal/gtk4";
import AppButton from "../buttons/app-button";
import Apps from "gi://AstalApps";
import { Variable, Binding } from "astal";

const apps = new Apps.Apps({});


export interface AppButtonResult {
  app: Apps.Application;
  index: number;
}


export default function getAppResults(searchText: string): AppButtonResult[] {
  const results = apps.fuzzy_query(searchText).slice(0, 5); // Limit to 7 results max
  return results.map((app, index) => ({ app, index }));
};


