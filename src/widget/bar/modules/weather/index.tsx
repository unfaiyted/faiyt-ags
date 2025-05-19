import { Gtk } from "astal/gtk4";
import { Widget } from "astal/gtk3";
import BarGroup from "../../utils/bar-group";
import MaterialIcon from "../../../utils/icons/material";
import { exec } from "astal/process";
import { Variable, bind } from "astal";
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

  const weatherSymbol = Variable("device_thermostat");
  const weatherLabel = Variable("Weather");
  const tooltipText = Variable("");

  const WEATHER_CACHE_PATH = WEATHER_CACHE_FOLDER + "/wttr.in.txt";

  const updateWeatherForCity = (city: string) =>
    actions.weather
      .update(city)
      .then((output) => {
        const weather = JSON.parse(output);
        writeFile(WEATHER_CACHE_PATH, JSON.stringify(weather));
        const weatherCode = ("CODE_" +
          weather.current_condition[0].weatherCode) as keyof typeof WwoCode;
        const weatherDesc = weather.current_condition[0].weatherDesc[0].value;
        const temperature =
          weather.current_condition[0][`temp_${config.weather.preferredUnit}`];
        const feelsLike =
          weather.current_condition[0][
          `FeelsLike${config.weather.preferredUnit}`
          ];

        // print("weather code:", weatherCode);

        const currWeatherSymbol =
          WeatherSymbol[
          WwoCode[weatherCode].toUpperCase() as keyof typeof WeatherSymbol
          ];
        // print(currWeatherSymbol);

        weatherSymbol.set(currWeatherSymbol);
        weatherLabel.set(
          `${temperature}°${config.weather.preferredUnit} • Feels like ${feelsLike}°${config.weather.preferredUnit}`,
        );
        tooltipText.set(weatherDesc);
      })
      .catch(() => {
        try {
          // Read from cache
          const weather = JSON.parse(readFile(WEATHER_CACHE_PATH));
          const weatherCode = ("CODE_" +
            weather.current_condition[0].weatherCode) as keyof typeof WwoCode;
          const weatherDesc = weather.current_condition[0].weatherDesc[0].value;
          const temperature =
            weather.current_condition[0][
            `temp_${config.weather.preferredUnit}`
            ];
          const feelsLike =
            weather.current_condition[0][
            `FeelsLike${config.weather.preferredUnit}`
            ];

          const currWeatherSymbol =
            WeatherSymbol[
            WwoCode[weatherCode].toUpperCase() as keyof typeof WeatherSymbol
            ];
          // print(currWeatherSymbol);

          weatherSymbol.set(currWeatherSymbol);
          weatherLabel.set(
            `${temperature}°${config.weather.preferredUnit} • Feels like ${feelsLike}°${config.weather.preferredUnit}`,
          );
          tooltipText.set(weatherDesc);
        } catch (err) {
          print(err);
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
