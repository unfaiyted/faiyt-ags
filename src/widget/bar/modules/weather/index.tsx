import { Widget, Gtk } from "astal/gtk4";
import { Variable, bind } from "astal";
import BarGroup from "../../utils/bar-group";
import MaterialIcon from "../../../utils/icons/material";
import { exec } from "astal/process";
import config from "../../../../utils/config";
import { actions } from "../../../../utils/actions";
import { writeFile, readFile } from "astal/file";
import GLib from "gi://GLib";
import { WeatherSymbol, WwoCode } from "./types";

const WEATHER_CACHE_FOLDER = `${GLib.get_user_cache_dir()}/ags/weather`;
exec(`mkdir -p ${WEATHER_CACHE_FOLDER}`);

export interface SideModuleProps extends Widget.BoxProps { }

export default function SideModule() {
  // const { setup, child, } = sideModuleProps;

  const weatherSymbol = new Variable("device_thermostat");
  const weatherLabel = new Variable("Weather");
  const tooltipText = new Variable("");

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
              const weatherDesc = condition.weatherDesc[0].value;
              
              // Make sure the temperature values exist
              const tempUnit = `temp_${config.weather.preferredUnit}`;
              const feelsLikeUnit = `FeelsLike${config.weather.preferredUnit}`;
              
              if (condition[tempUnit] && condition[feelsLikeUnit] && 
                  WwoCode[weatherCode]) {
                
                const temperature = condition[tempUnit];
                const feelsLike = condition[feelsLikeUnit];
    
                try {
                  const currWeatherSymbol = 
                    WeatherSymbol[WwoCode[weatherCode].toUpperCase() as keyof typeof WeatherSymbol];
                  
                  // Only set values if we have all the data
                  if (currWeatherSymbol) {
                    weatherSymbol.set(currWeatherSymbol);
                  } else {
                    weatherSymbol.set("device_thermostat"); // Default fallback
                  }
                  
                  weatherLabel.set(
                    `${temperature}°${config.weather.preferredUnit} • Feels like ${feelsLike}°${config.weather.preferredUnit}`,
                  );
                  tooltipText.set(weatherDesc);
                } catch (symbolErr) {
                  print("Symbol error:", symbolErr);
                  weatherSymbol.set("device_thermostat"); // Default fallback
                  weatherLabel.set("Weather unavailable");
                }
              } else {
                // Fallback for missing temperature data
                weatherSymbol.set("device_thermostat");
                weatherLabel.set("Weather data incomplete");
              }
            } else {
              // Fallback for missing weather description
              weatherSymbol.set("device_thermostat");
              weatherLabel.set("Weather description unavailable");
            }
          } else {
            // Fallback for missing weather data structure
            weatherSymbol.set("device_thermostat");
            weatherLabel.set("Weather data unavailable");
          }
        } catch (err) {
          print("Error parsing weather data:", err);
          weatherSymbol.set("device_thermostat");
          weatherLabel.set("Weather parse error");
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
              const weatherDesc = condition.weatherDesc[0].value;
              
              // Make sure the temperature values exist
              const tempUnit = `temp_${config.weather.preferredUnit}`;
              const feelsLikeUnit = `FeelsLike${config.weather.preferredUnit}`;
              
              if (condition[tempUnit] && condition[feelsLikeUnit] && 
                  WwoCode[weatherCode]) {
                
                const temperature = condition[tempUnit];
                const feelsLike = condition[feelsLikeUnit];
    
                try {
                  const currWeatherSymbol = 
                    WeatherSymbol[WwoCode[weatherCode].toUpperCase() as keyof typeof WeatherSymbol];
                  
                  // Only set values if we have all the data
                  if (currWeatherSymbol) {
                    weatherSymbol.set(currWeatherSymbol);
                  } else {
                    weatherSymbol.set("device_thermostat"); // Default fallback
                  }
                  
                  weatherLabel.set(
                    `${temperature}°${config.weather.preferredUnit} • Feels like ${feelsLike}°${config.weather.preferredUnit}`,
                  );
                  tooltipText.set(weatherDesc);
                } catch (symbolErr) {
                  print("Symbol error:", symbolErr);
                  weatherSymbol.set("device_thermostat"); // Default fallback
                  weatherLabel.set("Weather unavailable");
                }
              } else {
                // Fallback for missing temperature data
                weatherSymbol.set("device_thermostat");
                weatherLabel.set("Weather data incomplete");
              }
            } else {
              // Fallback for missing weather description
              weatherSymbol.set("device_thermostat");
              weatherLabel.set("Weather description unavailable");
            }
          } else {
            // Fallback for missing weather data structure
            weatherSymbol.set("device_thermostat");
            weatherLabel.set("Weather data unavailable");
          }
        } catch (err) {
          // Fallback for JSON parsing errors or missing cache
          print(err);
          weatherSymbol.set("device_thermostat");
          weatherLabel.set("Weather unavailable");
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
        tooltipMarkup={bind(tooltipText)}
        cssName="spacing-h-4 txt-onSurfaceVariant"
      >
        <MaterialIcon icon={bind(weatherSymbol)} size="small" />
        <label label={bind(weatherLabel)} />
      </box>
    </BarGroup>
  );
}
