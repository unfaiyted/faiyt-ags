import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind } from "astal";
import BarGroup from "../../utils/bar-group";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { exec } from "astal/process";
import config from "../../../../utils/config";
import { actions } from "../../../../utils/actions";
import { writeFile, readFile } from "astal/file";
import GLib from "gi://GLib";
import { WwoCode } from "./types";
import { PhosphorIcons, PhosphorIconStyle } from "../../../utils/icons/types";
import { theme } from "../../../../utils/color";

const WEATHER_CACHE_FOLDER = `${GLib.get_user_cache_dir()}/ags/weather`;
exec(`mkdir -p ${WEATHER_CACHE_FOLDER}`);

export interface SideModuleProps extends Widget.BoxProps { }

// Map weather conditions to Phosphor icons (using actual existing icon names)
const WEATHER_ICON_MAP: Record<string, PhosphorIcons> = {
  SUNNY: PhosphorIcons.Sun,
  PARTLY_CLOUDY: PhosphorIcons.CloudSun,
  CLOUDY: PhosphorIcons.Cloud,
  VERY_CLOUDY: PhosphorIcons.Cloud,
  FOG: PhosphorIcons.CloudFog,
  LIGHT_SHOWERS: PhosphorIcons.CloudRain,
  LIGHT_RAIN: PhosphorIcons.CloudRain,
  HEAVY_SHOWERS: PhosphorIcons.CloudRain,
  HEAVY_RAIN: PhosphorIcons.CloudRain,
  LIGHT_SNOW: PhosphorIcons.CloudSnow,
  HEAVY_SNOW: PhosphorIcons.CloudSnow,
  LIGHT_SNOW_SHOWERS: PhosphorIcons.CloudSnow,
  HEAVY_SNOW_SHOWERS: PhosphorIcons.CloudSnow,
  THUNDERY_SHOWERS: PhosphorIcons.CloudLightning,
  THUNDERY_HEAVY_RAIN: PhosphorIcons.CloudLightning,
  THUNDERY_SNOW_SHOWERS: PhosphorIcons.CloudLightning,
  LIGHT_SLEET: PhosphorIcons.CloudRain,
  LIGHT_SLEET_SHOWERS: PhosphorIcons.CloudRain,
  DEFAULT: PhosphorIcons.Thermometer
};

// Get temperature-based color (blue for cold, red for warm) using Rosé Pine colors
function getTempColor(temp: number): string {
  if (temp <= 0) return theme.pine; // pine (cold blue)
  if (temp <= 10) return theme.foam; // foam (cool blue)
  if (temp <= 20) return theme.iris; // iris (cool purple)
  if (temp <= 25) return theme.text; // text (neutral white)
  if (temp <= 30) return theme.gold; // gold (warm yellow)
  if (temp <= 35) return theme.rose; // rose (warm pink)
  return theme.love; // love (hot red)
}

// Get weather condition color using Rosé Pine colors
function getWeatherColor(condition: string): string {
  switch (condition.toUpperCase()) {
    case "SUNNY": return theme.gold; // gold (bright sunny)
    case "PARTLY_CLOUDY": return theme.subtle; // subtle (light clouds)
    case "CLOUDY":
    case "VERY_CLOUDY": return theme.muted; // muted (heavy clouds)
    case "FOG": return theme.overlay; // overlay (misty)
    case "LIGHT_RAIN":
    case "LIGHT_SHOWERS":
    case "HEAVY_RAIN":
    case "HEAVY_SHOWERS": return theme.pine; // pine (rain blue)
    case "LIGHT_SNOW":
    case "HEAVY_SNOW":
    case "LIGHT_SNOW_SHOWERS":
    case "HEAVY_SNOW_SHOWERS": return theme.foam; // foam (snow blue)
    case "THUNDERY_SHOWERS":
    case "THUNDERY_HEAVY_RAIN":
    case "THUNDERY_SNOW_SHOWERS": return theme.iris; // iris (electric purple)
    default: return theme.text; // text (default white)
  }
}

export default function SideModule() {
  const weatherIcon = new Variable(PhosphorIcons.Thermometer);
  const weatherIconColor = new Variable(theme.foreground);
  const temperature = new Variable(0);
  const feelsLike = new Variable(0);
  const weatherDesc = new Variable(":/");
  const tooltipText = new Variable("");
  const tempColor = new Variable(theme.foreground);

  const WEATHER_CACHE_PATH = WEATHER_CACHE_FOLDER + "/wttr.in.txt";

  const updateWeatherForCity = (city: string) =>
    actions.weather
      .update(city)
      .then((output) => {
        try {
          const weather = JSON.parse(output);
          writeFile(WEATHER_CACHE_PATH, JSON.stringify(weather));

          // Ensure all needed data exists before using it
          if (weather && weather.current_condition && weather.current_condition[0]) {
            const condition = weather.current_condition[0];

            if (condition.weatherCode && condition.weatherDesc &&
              condition.weatherDesc[0] && condition.weatherDesc[0].value) {

              const weatherCode = ("CODE_" + condition.weatherCode) as keyof typeof WwoCode;
              const weatherDescription = condition.weatherDesc[0].value;

              // Make sure the temperature values exist
              const tempUnit = `temp_${config.weather.preferredUnit}`;
              const feelsLikeUnit = `FeelsLike${config.weather.preferredUnit}`;

              if (condition[tempUnit] && condition[feelsLikeUnit] &&
                WwoCode[weatherCode]) {

                const tempValue = parseInt(condition[tempUnit]);
                const feelsLikeValue = parseInt(condition[feelsLikeUnit]);

                try {
                  const weatherCondition = WwoCode[weatherCode];

                  // Set icon based on weather condition
                  const iconName = WEATHER_ICON_MAP[weatherCondition.toUpperCase()] || WEATHER_ICON_MAP.DEFAULT;
                  weatherIcon.set(iconName);
                  print("weatherIcon:", weatherIcon.get());

                  // Set color based on weather condition
                  const iconColor = getWeatherColor(weatherCondition);
                  weatherIconColor.set(iconColor);

                  // Set temperature values
                  temperature.set(tempValue);
                  feelsLike.set(feelsLikeValue);
                  tempColor.set(getTempColor(tempValue));
                  weatherDesc.set(`${tempValue}°${config.weather.preferredUnit}`);
                  tooltipText.set(`${weatherDescription} - Feels like ${feelsLikeValue}°${config.weather.preferredUnit}`);
                } catch (symbolErr) {
                  print("Symbol error:", symbolErr);
                  weatherIcon.set(PhosphorIcons.Thermometer);
                  weatherIconColor.set(theme.foreground);
                  weatherDesc.set("Weather unavailable");
                }
              } else {
                // Fallback for missing temperature data
                weatherIcon.set(PhosphorIcons.Thermometer);
                weatherIconColor.set(theme.foreground);
                weatherDesc.set("Weather data incomplete");
              }
            } else {
              // Fallback for missing weather description
              weatherIcon.set(PhosphorIcons.Thermometer);
              weatherIconColor.set(theme.foreground);
              weatherDesc.set("Weather description unavailable");
            }
          } else {
            // Fallback for missing weather data structure
            weatherIcon.set(PhosphorIcons.Thermometer);
            weatherIconColor.set(theme.foreground);
            weatherDesc.set("Weather data unavailable");
          }
        } catch (err) {
          print("Error parsing weather data:", err);
          weatherIcon.set(PhosphorIcons.Thermometer);
          weatherIconColor.set(theme.foreground);
          weatherDesc.set("Weather parse error");
        }
      })
      .catch(() => {
        try {
          // Read from cache
          const weather = JSON.parse(readFile(WEATHER_CACHE_PATH));

          // Ensure all needed data exists before using it
          if (weather && weather.current_condition && weather.current_condition[0]) {
            const condition = weather.current_condition[0];

            if (condition.weatherCode && condition.weatherDesc &&
              condition.weatherDesc[0] && condition.weatherDesc[0].value) {

              const weatherCode = ("CODE_" + condition.weatherCode) as keyof typeof WwoCode;
              const weatherDescription = condition.weatherDesc[0].value;

              // Make sure the temperature values exist
              const tempUnit = `temp_${config.weather.preferredUnit}`;
              const feelsLikeUnit = `FeelsLike${config.weather.preferredUnit}`;

              if (condition[tempUnit] && condition[feelsLikeUnit] &&
                WwoCode[weatherCode]) {

                const tempValue = parseInt(condition[tempUnit]);
                const feelsLikeValue = parseInt(condition[feelsLikeUnit]);

                try {
                  const weatherCondition = WwoCode[weatherCode];

                  // Set icon based on weather condition
                  const iconName = WEATHER_ICON_MAP[weatherCondition.toUpperCase()] || WEATHER_ICON_MAP.DEFAULT;
                  weatherIcon.set(iconName);

                  // Set color based on weather condition
                  const iconColor = getWeatherColor(weatherCondition);
                  weatherIconColor.set(iconColor);

                  // Set temperature values
                  temperature.set(tempValue);
                  feelsLike.set(feelsLikeValue);
                  tempColor.set(getTempColor(tempValue));
                  weatherDesc.set(`${tempValue}°${config.weather.preferredUnit}`);
                  tooltipText.set(`${weatherDescription} - Feels like ${feelsLikeValue}°${config.weather.preferredUnit}`);
                } catch (symbolErr) {
                  print("Symbol error:", symbolErr);
                  weatherIcon.set(PhosphorIcons.Thermometer);
                  weatherIconColor.set(theme.foreground);
                  weatherDesc.set("Weather unavailable");
                }
              } else {
                // Fallback for missing temperature data
                weatherIcon.set(PhosphorIcons.Thermometer);
                weatherIconColor.set(theme.foreground);
                weatherDesc.set("Weather data incomplete");
              }
            } else {
              // Fallback for missing weather description
              weatherIcon.set(PhosphorIcons.Thermometer);
              weatherIconColor.set(theme.foreground);
              weatherDesc.set("Weather description unavailable");
            }
          } else {
            // Fallback for missing weather data structure
            weatherIcon.set(PhosphorIcons.Thermometer);
            weatherIconColor.set(theme.foreground);
            weatherDesc.set("Weather data unavailable");
          }
        } catch (err) {
          // Fallback for JSON parsing errors or missing cache
          print(err);
          weatherIcon.set(PhosphorIcons.Thermometer);
          weatherIconColor.set(theme.foreground);
          weatherDesc.set("Weather unavailable");
        }
      });
  if (config.weather.city != "" && config.weather.city != null) {
    updateWeatherForCity(config.weather.city.replace(/ /g, "%20"));
  } else {
    actions.network.ipCityInfo().then(updateWeatherForCity).catch(print);
  }

  return (
    <BarGroup>
      <box
        halign={Gtk.Align.CENTER}
        hexpand={true}
        tooltipText={bind(tooltipText)}
        cssName="spacing-h-4 txt-onSurfaceVariant"
        setup={(box) => {
          const motionController = new Gtk.EventControllerMotion();

          motionController.connect("enter", () => {
            // Show feels like temperature on hover
            const tempValue = temperature.get();
            const feelsLikeValue = feelsLike.get();
            box.set_tooltip_text(`${tempValue}°${config.weather.preferredUnit} - Feels like ${feelsLikeValue}°${config.weather.preferredUnit}`);
          });

          motionController.connect("leave", () => {
            // Revert to weather description
            box.set_tooltip_text(tooltipText.get());
          });

          box.add_controller(motionController);
        }}
      >
        <PhosphorIcon
          iconName={bind(weatherIcon)}
          color={bind(weatherIconColor)}
          style={PhosphorIconStyle.Duotone}
          marginEnd={6}
          size={16}
        />
        <label
          marginEnd={6}
          label={bind(weatherDesc)}
          setup={(label) => {
            tempColor.subscribe((color) => {
              label.set_markup(`<span color="${color}">${weatherDesc.get()}</span>`);
            });
            weatherDesc.subscribe((text) => {
              label.set_markup(`<span color="${tempColor.get()}">${text}</span>`);
            });
          }}
        />
      </box>
    </BarGroup>
  );
}
