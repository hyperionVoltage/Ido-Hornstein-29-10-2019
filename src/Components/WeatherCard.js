import React, { useContext } from "react";
import styles from "../Styles/weathercard.module.css";
import { StateContext } from "../Context/StateContext";

function WeatherCard(props) {
  const stateProvider = useContext(StateContext);

  const { details } = props;

  let weatherDate = new Date(details.Date);
  let minTemperature = details.Temperature.Minimum;
  let maxTemperature = details.Temperature.Maximum;
  let wholeDayWeather = false;

  if (details.Day.IconPhrase === details.Night.IconPhrase) {
    wholeDayWeather = true;
  }

  return (
    <div
      className={styles.weather_card}
      style={stateProvider.themeStyle.themesStylesWhole}
    >
      <div className={styles.weather_day_name}>
        {weatherDate
          .toLocaleDateString("us-en", { weekday: "long" })
          .substr(0, 3)}
      </div>
      <div className={styles.weather_max_temp}>
        {Math.round(maxTemperature.Value)}
        {stateProvider.metricUnitProvider.metricUnits ? "\u00b0" : "\u2109"}/
        <span className={styles.weather_min_temp}>
          {Math.round(minTemperature.Value)}
          {stateProvider.metricUnitProvider.metricUnits ? "\u00b0" : "\u2109"}
        </span>
      </div>
      {wholeDayWeather ? (
        <div className={styles.weather_whole_day}>{details.Day.IconPhrase}</div>
      ) : (
        <div>
          <div className={styles.weather_day_info}>
            Day: {details.Day.IconPhrase}
          </div>
          <div className={styles.weather_day_night_divide} />
          <div className={styles.weather_night_info}>
            Night: {details.Night.IconPhrase}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherCard;
