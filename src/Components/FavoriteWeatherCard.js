import React, { useEffect, useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import styles from "../Styles/favoriteweathercard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { StateContext } from "../Context/StateContext";
import axios from "axios";

function FavoriteWeatherCard(props) {
  const stateProvider = useContext(StateContext);

  const [navigateToDetails, setNavigateToDetails] = useState(false);

  const [weatherStatus, setWeatherStatus] = useState({
    WeatherText: "Default",
    Temperature: {
      Metric: {
        Value: 0
      },
      Imperial: {
        Value: 0
      }
    }
  });

  var favoriteLocationsArray = [];

  useEffect(() => {
    async function retriveSingleLocationCurrentWeather() {
      const res = await axios
        .get(
          "https://dataservice.accuweather.com/currentconditions/v1/" +
            props.locationCode,
          {
            params: {
              apikey: process.env.REACT_APP_WEATHER_API_KEY,
              language: "en-us",
              details: false
            }
          }
        )
        .catch(e => {
          console.error(e);
          stateProvider.errorsProvider.setErrors([
            ...stateProvider.errorsProvider.errors,
            "Error fetching current weather"
          ]);
        });
      if (res) {
        setWeatherStatus(res.data[0]);
      }
    }
    retriveSingleLocationCurrentWeather();
  }, []);

  return (
    <React.Fragment>
      {navigateToDetails ? (
        displayFullDetails()
      ) : (
        <React.Fragment>
          <div
            className={styles.container}
            style={stateProvider.themeStyle.themesStylesWhole}
          >
            <div
              className={styles.seperator}
              onClick={() => {
                setNavigateToDetails(true);
              }}
            >
              <div className={styles.location_name}>{props.locationName}</div>
              <div className={styles.location_temp}>
                {stateProvider.metricUnitProvider.metricUnits
                  ? weatherStatus.Temperature.Metric.Value + "\u00b0"
                  : weatherStatus.Temperature.Imperial.Value + "\u2109"}
              </div>
              <div className={styles.location_weather}>
                {weatherStatus.WeatherText}
              </div>
            </div>
            <div className={styles.remove_button}>
              <FontAwesomeIcon
                icon={faTimes}
                className={styles.remove_icon}
                onClick={() => {
                  favoriteLocationsArray =
                    stateProvider.favoriteLocationsProvider.favoriteLocations;
                  favoriteLocationsArray.splice(props.index, 1);
                  stateProvider.favoriteLocationsProvider.setFavoriteLocations([
                    ...favoriteLocationsArray
                  ]);
                  stateProvider.searchedFavoritesProvider.setSearchedFavorites(
                    ""
                  );
                  stateProvider.favoriteSearchBarEl.current.value = "";
                }}
              />
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );

  function displayFullDetails() {
    console.log("Came from - ");
    console.log(props);
    stateProvider.locationCodeProvider.setLocationCode(props.locationCode);
    stateProvider.selectedLocationProvider.setSelectedLocation(
      props.locationName
    );
    stateProvider.searchedFavoritesProvider.setSearchedFavorites("");
    stateProvider.favoriteSearchBarEl.current.value = "";
    return <Redirect to="/" push />;
  }
}

export default FavoriteWeatherCard;
