import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind } from "astal";
import BarGroup from "../../utils/bar-group";
import { PhosphorIcon } from "../../../utils/icons/phosphor";
import { exec } from "astal/process";
import configManager from "../../../../services/config-manager";
import { actions } from "../../../../utils/actions";
import { writeFile, readFile } from "astal/file";
import GLib from "gi://GLib";
import { WwoCode } from "./types";
import { PhosphorIcons, PhosphorIconStyle } from "../../../utils/icons/types";
import { ThemeColor } from "../../../../styles/themes";
import themeManager from "../../../../services/theme-manager";
import { barLogger as log } from "../../../../utils/logger";

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
function getTempColor(temp: number): ThemeColor {
  if (temp <= 0) return ThemeColor.Pine; // pine (cold blue)
  if (temp <= 10) return ThemeColor.Foam; // foam (cool blue)
  if (temp <= 20) return ThemeColor.Iris; // iris (cool purple)
  if (temp <= 25) return ThemeColor.Text; // text (neutral white)
  if (temp <= 30) return ThemeColor.Gold; // gold (warm yellow)
  if (temp <= 35) return ThemeColor.Rose; // rose (warm pink)
  return ThemeColor.Love; // love (hot red)
}

// Get weather condition color using Rosé Pine colors
function getWeatherColor(condition: string): ThemeColor {
  switch (condition.toUpperCase()) {
    case "SUNNY": return ThemeColor.Gold; // gold (bright sunny)
    case "PARTLY_CLOUDY": return ThemeColor.Subtle; // subtle (light clouds)
    case "CLOUDY":
    case "VERY_CLOUDY": return ThemeColor.Muted; // muted (heavy clouds)
    case "FOG": return ThemeColor.Overlay; // overlay (misty)
    case "LIGHT_RAIN":
    case "LIGHT_SHOWERS":
    case "HEAVY_RAIN":
    case "HEAVY_SHOWERS": return ThemeColor.Pine; // pine (rain blue)
    case "LIGHT_SNOW":
    case "HEAVY_SNOW":
    case "LIGHT_SNOW_SHOWERS":
    case "HEAVY_SNOW_SHOWERS": return ThemeColor.Foam; // foam (snow blue)
    case "THUNDERY_SHOWERS":
    case "THUNDERY_HEAVY_RAIN":
    case "THUNDERY_SNOW_SHOWERS": return ThemeColor.Iris; // iris (electric purple)
    default: return ThemeColor.Text; // text (default white)
  }
}

export default function SideModule() {
  const weatherIcon = new Variable(PhosphorIcons.Thermometer);
  const weatherIconColor = new Variable(ThemeColor.Foreground);
  const temperature = new Variable(0);
  const feelsLike = new Variable(0);
  const weatherDesc = new Variable(":/");
  const tooltipText = new Variable("");
  const tempColor = new Variable(ThemeColor.Foreground);

  const WEATHER_CACHE_PATH = WEATHER_CACHE_FOLDER + "/wttr.in.txt";

  const updateWeatherForCity = (city: string) => {
    // Format city name for wttr.in API
    // Replace spaces with + for better compatibility
    const formattedCity = city.replace(/ /g, "+");

    return actions.weather
      .update(formattedCity)
      .then((output) => {
        log.debug("Raw weather API response", { city: formattedCity, output: output.substring(0, 200) });

        // Check if the response is an error message (not JSON)
        if (output.startsWith("Unknown location") || output.includes("please try")) {
          log.warn("Weather API returned location error", { city: formattedCity, response: output });

          // Try to extract coordinates from the error message
          const coordMatch = output.match(/~(-?\d+\.\d+),(-?\d+\.\d+)/);
          if (coordMatch) {
            const [, lat, lon] = coordMatch;
            log.info("Retrying with coordinates from error message", { lat, lon });
            return actions.weather.update(`${lat},${lon}`);
          }

          throw new Error(`Location not recognized: ${city}`);
        }

        return output;
      })
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
              const preferredUnit = configManager.getValue("weather.preferredUnit") || "C";
              const tempUnit = `temp_${preferredUnit}`;
              const feelsLikeUnit = `FeelsLike${preferredUnit}`;

              if (condition[tempUnit] && condition[feelsLikeUnit] &&
                WwoCode[weatherCode]) {

                const tempValue = parseInt(condition[tempUnit]);
                const feelsLikeValue = parseInt(condition[feelsLikeUnit]);

                try {
                  const weatherCondition = WwoCode[weatherCode];

                  // Set icon based on weather condition
                  const iconName = WEATHER_ICON_MAP[weatherCondition.toUpperCase()] || WEATHER_ICON_MAP.DEFAULT;
                  weatherIcon.set(iconName);
                  log.debug("Weather icon set", { icon: weatherIcon.get() });

                  // Set color based on weather condition
                  const iconColor = getWeatherColor(weatherCondition);
                  weatherIconColor.set(iconColor);

                  // Set temperature values
                  temperature.set(tempValue);
                  feelsLike.set(feelsLikeValue);
                  tempColor.set(getTempColor(tempValue));
                  weatherDesc.set(`${tempValue}°${preferredUnit}`);
                  tooltipText.set(`${weatherDescription} - Feels like ${feelsLikeValue}°${preferredUnit}`);
                } catch (symbolErr) {
                  log.error("Weather symbol error", { error: symbolErr });
                  weatherIcon.set(PhosphorIcons.Thermometer);
                  weatherIconColor.set(ThemeColor.Foreground);
                  weatherDesc.set("Weather unavailable");
                }
              } else {
                // Fallback for missing temperature data
                weatherIcon.set(PhosphorIcons.Thermometer);
                weatherIconColor.set(ThemeColor.Foreground);
                weatherDesc.set("Weather data incomplete");
              }
            } else {
              // Fallback for missing weather description
              weatherIcon.set(PhosphorIcons.Thermometer);
              weatherIconColor.set(ThemeColor.Foreground);
              weatherDesc.set("Weather description unavailable");
            }
          } else {
            // Fallback for missing weather data structure
            weatherIcon.set(PhosphorIcons.Thermometer);
            weatherIconColor.set(ThemeColor.Foreground);
            weatherDesc.set("Weather data unavailable");
          }
        } catch (err) {
          log.error("Error parsing weather data", {
            error: err instanceof Error ? {
              message: err.message,
              stack: err.stack,
              name: err.name
            } : err,
            rawOutput: output ? output.substring(0, 500) : 'No output',
            outputType: typeof output,
            city
          });
          weatherIcon.set(PhosphorIcons.Thermometer);
          weatherIconColor.set(ThemeColor.Foreground);
          weatherDesc.set("?");
        }
      })
      .catch((error) => {
        log.error("Failed to fetch weather from API", {
          city,
          error: error instanceof Error ? {
            message: error.message,
            stack: error.stack,
            name: error.name
          } : error
        });
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
              const preferredUnit = configManager.getValue("weather.preferredUnit") || "C";
              const tempUnit = `temp_${preferredUnit}`;
              const feelsLikeUnit = `FeelsLike${preferredUnit}`;

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
                  weatherDesc.set(`${tempValue}°${preferredUnit}`);
                  tooltipText.set(`${weatherDescription} - Feels like ${feelsLikeValue}°${preferredUnit}`);
                } catch (symbolErr) {
                  log.error("Weather symbol error", { error: symbolErr });
                  weatherIcon.set(PhosphorIcons.Thermometer);
                  weatherIconColor.set(ThemeColor.Foreground);
                  weatherDesc.set("Weather unavailable");
                }
              } else {
                // Fallback for missing temperature data
                weatherIcon.set(PhosphorIcons.Thermometer);
                weatherIconColor.set(ThemeColor.Foreground);
                weatherDesc.set("Weather data incomplete");
              }
            } else {
              // Fallback for missing weather description
              weatherIcon.set(PhosphorIcons.Thermometer);
              weatherIconColor.set(ThemeColor.Foreground);
              weatherDesc.set("Weather description unavailable");
            }
          } else {
            // Fallback for missing weather data structure
            weatherIcon.set(PhosphorIcons.Thermometer);
            weatherIconColor.set(ThemeColor.Foreground);
            weatherDesc.set("Weather data unavailable");
          }
        } catch (err) {
          // Fallback for JSON parsing errors or missing cache
          log.error("Failed to read weather cache", { error: err });
          weatherIcon.set(PhosphorIcons.Thermometer);
          weatherIconColor.set(ThemeColor.Foreground);
          weatherDesc.set("Weather unavailable");
        }
      });
  };

  const weatherCity = configManager.getValue("weather.city");
  log.debug("Weather city configuration", { configuredCity: weatherCity });

  if (weatherCity && weatherCity !== "") {
    log.info("Using configured weather city", { city: weatherCity });
    updateWeatherForCity(weatherCity);
  } else {
    log.info("No weather city configured, detecting from IP");
    actions.network.ipCityInfo()
      .then((detectedCity) => {
        log.info("Detected city from IP", { city: detectedCity });
        updateWeatherForCity(detectedCity);
      })
      .catch((error) => {
        log.error("Failed to detect city from IP", {
          error: error instanceof Error ? {
            message: error.message,
            stack: error.stack
          } : error
        });
      });
  }

  // Subscribe to config changes for weather settings
  configManager.connect("config-changed", (_, path: string) => {
    if (path.startsWith("weather.")) {
      log.debug("Weather config changed, updating", { path });
      const newCity = configManager.getValue("weather.city");
      if (newCity && newCity !== "") {
        updateWeatherForCity(newCity);
      } else {
        actions.network.ipCityInfo().then(updateWeatherForCity).catch(print);
      }
    }
  });

  // Update weather every 30 minutes
  GLib.timeout_add(GLib.PRIORITY_DEFAULT, 30 * 60 * 1000, () => {
    const city = configManager.getValue("weather.city");
    if (city && city !== "") {
      updateWeatherForCity(city);
    } else {
      actions.network.ipCityInfo().then(updateWeatherForCity).catch(print);
    }
    return GLib.SOURCE_CONTINUE;
  });

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
            const preferredUnit = configManager.getValue("weather.preferredUnit") || "C";
            box.set_tooltip_text(`${tempValue}°${preferredUnit} - Feels like ${feelsLikeValue}°${preferredUnit}`);
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
            const updateLabel = () => {
              const colorEnum = tempColor.get();
              const actualColor = themeManager.getColor(colorEnum as any);
              label.set_markup(`<span color="${actualColor}">${weatherDesc.get()}</span>`);
            };
            
            tempColor.subscribe(updateLabel);
            weatherDesc.subscribe(updateLabel);
            
            // Update on theme change
            themeManager.connect('theme-changed', updateLabel);
          }}
        />
      </box>
    </BarGroup>
  );
}
