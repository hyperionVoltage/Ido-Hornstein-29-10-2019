import React, { useContext, useEffect, useState } from "react";
import styles from "../Styles/singularlocationweatherdisplay.module.css";
import { StateContext } from "../Context/StateContext";

import WeatherCard from "./WeatherCard";
import axios from "axios";

function SingularLocationWeatherDisplay() {
  const stateProvider = useContext(StateContext);

  const [backgroundImage, setBackgroundImage] = useState("");

  var latLong = "";

  useEffect(() => {
    if (!stateProvider.usedGeolocationProvider.usedGeolocation) {
      async function getGeolocation() {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(async function(position) {
            latLong = await (position.coords.latitude +
              "," +
              position.coords.longitude);
            const request = axios
              .get(
                "https://dataservice.accuweather.com/locations/v1/cities/geoposition/search",
                {
                  params: {
                    apikey: process.env.REACT_APP_WEATHER_API_KEY,
                    q: latLong,
                    language: "en-us",
                    details: false,
                    toplevel: true
                  }
                }
              )
              .catch(e => {
                console.error(e);
                stateProvider.errorsProvider.setErrors([
                  ...stateProvider.errorsProvider.errors,
                  "Error fetching geolocation data"
                ]);
              })
              .then(res => {
                if (res) {
                  stateProvider.locationCodeProvider.setLocationCode(
                    res.data.Key
                  );
                  stateProvider.selectedLocationProvider.setSelectedLocation(
                    res.data.LocalizedName +
                      ", " +
                      res.data.AdministrativeArea.LocalizedName +
                      ", " +
                      res.data.Country.LocalizedName
                  );
                }
              });

            stateProvider.usedGeolocationProvider.setUsedGeolocation(true);
          });
        }
      }
      getGeolocation();
    }
  }, [stateProvider.usedGeolocationProvider.usedGeolocation]);

  useEffect(() => {
    if (stateProvider.selectedLocationProvider.selectedLocation) {
      async function getBackgroundImageFromLocation() {
        const res = await axios
          .get("https://api.unsplash.com/search/photos", {
            params: {
              query: stateProvider.selectedLocationProvider.selectedLocation,
              orientation: "landscape"
            },
            headers: {
              Authorization:
                "Client-ID " + process.env.REACT_APP_USPLASH_API_KEY
            }
          })
          .catch(e => {
            console.error(e);
            stateProvider.errorsProvider.setErrors([
              ...stateProvider.errorsProvider.errors,
              "Error fetching background image"
            ]);
          });
        if (res) {
          if (res.data.results.length !== 0) {
            setBackgroundImage(
              res.data.results[
                Math.floor(Math.random() * res.data.results.length)
              ].links.download
            );
          }
        }
      }
      getBackgroundImageFromLocation();

      async function getCurrentWeather() {
        if (stateProvider.locationCodeProvider.locationCode) {
          const res = await axios
            .get(
              "https://dataservice.accuweather.com/currentconditions/v1/" +
                stateProvider.locationCodeProvider.locationCode,
              {
                params: {
                  apikey: process.env.REACT_APP_WEATHER_API_KEY,
                  language: "en-us",
                  metric: stateProvider.metricUnitProvider.metricUnits
                }
              }
            )
            .catch(e => {
              console.error(e);
              stateProvider.errorsProvider.setErrors([
                ...stateProvider.errorsProvider.errors,
                "Error current location data"
              ]);
            });
          if (res) {
            stateProvider.currentWeatherProvider.setCurrentWeather(res.data[0]);
          }
        }
      }
      getCurrentWeather();
    }
  }, [stateProvider.selectedLocationProvider.selectedLocation]);

  let forecast = [];

  if (stateProvider.forecastProvider.forecast) {
    stateProvider.forecastProvider.forecast.DailyForecasts.map(
      (forecastDetails, key) => {
        forecast.push(<WeatherCard details={forecastDetails} key={key} />);
      }
    );
  }

  return (
    <div
      className={styles.location_image}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div
        className={styles.location_title}
        style={stateProvider.themeStyle.themesStylesWhole}
      >
        {stateProvider.selectedLocationProvider.selectedLocation}
      </div>
      <div className={styles.container}>
        {stateProvider.currentWeatherProvider.currentWeather ? (
          <div
            className={styles.current_weather}
            style={stateProvider.themeStyle.themesStylesWhole}
          >
            <div className={styles.current_weather_weather_type}>
              Current Weather -{" "}
              {stateProvider.currentWeatherProvider.currentWeather.WeatherText}{" "}
              /{" "}
              {stateProvider.metricUnitProvider.metricUnits
                ? stateProvider.currentWeatherProvider.currentWeather
                    .Temperature.Metric.Value + "\u00b0"
                : stateProvider.currentWeatherProvider.currentWeather
                    .Temperature.Imperial.Value + "\u2109"}
            </div>
          </div>
        ) : (
          <div></div>
        )}
        {forecast}
      </div>
    </div>
  );
}

export default SingularLocationWeatherDisplay;
