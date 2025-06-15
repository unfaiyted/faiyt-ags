import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind } from "astal";
import themeManager from "../../services/theme-manager";
import PhosphorIcon from "../utils/icons/phosphor";
import { PhosphorIcons } from "../utils/icons/types";
import { log } from "../../utils/logger";

interface ThemeSelectorProps extends Widget.BoxProps {}

const ThemeOption = ({ name, displayName, isActive, onSelect }: {
  name: string;
  displayName: string;
  isActive: boolean;
  onSelect: () => void;
}) => {
  const themeIcons: Record<string, PhosphorIcons> = {
    "rose-pine": PhosphorIcons.Moon,
    "rose-pine-moon": PhosphorIcons.MoonStars,
    "rose-pine-dawn": PhosphorIcons.Sun,
  };

  const themeDescriptions: Record<string, string> = {
    "rose-pine": "Dark theme with muted colors",
    "rose-pine-moon": "Darker variant with softer tones",
    "rose-pine-dawn": "Light theme for daytime use",
  };

  return (
    <button
      cssName="theme-option"
      cssClasses={isActive ? ["active"] : []}
      onClicked={onSelect}
    >
      <box vertical cssClasses={["spacing-v-10"]}>
        <box cssClasses={["spacing-h-10"]}>
          <PhosphorIcon 
            iconName={themeIcons[name] || PhosphorIcons.Palette} 
            size={24} 
          />
          <box vertical hexpand>
            <label 
              label={displayName} 
              cssName="theme-name" 
              halign={Gtk.Align.START} 
            />
            <label 
              label={themeDescriptions[name] || "Custom theme"} 
              cssName="theme-description" 
              halign={Gtk.Align.START} 
            />
          </box>
          {isActive && (
            <PhosphorIcon 
              iconName={PhosphorIcons.CheckCircle} 
              size={20} 
              cssName="theme-active-icon"
            />
          )}
        </box>
        
        {/* Theme color preview */}
        <box cssName="theme-preview" cssClasses={["spacing-h-5"]}>
          <box cssClasses={["theme-color-swatch", `theme-${name}-base`]} />
          <box cssClasses={["theme-color-swatch", `theme-${name}-surface`]} />
          <box cssClasses={["theme-color-swatch", `theme-${name}-overlay`]} />
          <box cssClasses={["theme-color-swatch", `theme-${name}-primary`]} />
          <box cssClasses={["theme-color-swatch", `theme-${name}-accent`]} />
          <box cssClasses={["theme-color-swatch", `theme-${name}-text`]} />
        </box>
      </box>
    </button>
  );
};

export default function ThemeSelector(props: ThemeSelectorProps) {
  const currentTheme = Variable(themeManager.getTheme());
  const availableThemes = themeManager.getAvailableThemes();

  // Listen for theme changes
  themeManager.connect("theme-changed", (self, themeName: string) => {
    currentTheme.set(themeName);
  });

  return (
    <box vertical cssName="theme-selector" cssClasses={["spacing-v-15"]} {...props}>
      <box cssClasses={["spacing-h-10", "section-header"]}>
        <PhosphorIcon iconName={PhosphorIcons.Palette} size={20} />
        <label label="Theme" cssName="section-title" hexpand halign={Gtk.Align.START} />
      </box>

      <box vertical cssClasses={["spacing-v-10"]}>
        {bind(currentTheme).as(ct => 
          availableThemes.map(theme => (
            <ThemeOption
              key={theme.name}
              name={theme.name}
              displayName={theme.displayName}
              isActive={ct === theme.name}
              onSelect={() => {
                log.info(`Switching theme to: ${theme.name}`);
                themeManager.setTheme(theme.name);
              }}
            />
          ))
        )}
      </box>

      {/* Theme customization hint */}
      <box cssName="theme-hint" cssClasses={["spacing-h-5"]}>
        <PhosphorIcon iconName={PhosphorIcons.Info} size={14} />
        <label 
          label="Theme changes are applied instantly" 
          cssName="hint-text"
          halign={Gtk.Align.START}
        />
      </box>
    </box>
  );
}