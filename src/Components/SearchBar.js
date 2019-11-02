import React, { useContext, useState, useEffect, useRef } from "react";
import styles from "../Styles/searchbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearchLocation,
  faPlusCircle,
  faMinusCircle
} from "@fortawesome/free-solid-svg-icons";
import { StateContext } from "../Context/StateContext";
import axios from "axios";

function SearchBar() {
  const stateProvider = useContext(StateContext);

  const [relatedLocationList, setRelatedLocationList] = useState([]);
  const [favoritesElement, setFavoritesElement] = useState(false);

  const searchBarEl = useRef(null);

  let displayedRelatedLocation = "";
  let relatedLocationsElements = [];
  let relatedLocationsCodes = [];
  let relatedLocationsNames = [];
  let tempFavoriteArray = [];

  stateProvider.locationProvider.setLocation();

  useEffect(() => {
    if (stateProvider.locationProvider.location) {
      async function getAutocompletedLocationName() {
        const res = await axios
          .get(
            "http://dataservice.accuweather.com/locations/v1/cities/autocomplete",
            {
              params: {
                apikey: process.env.REACT_APP_WEATHER_API_KEY,
                q: stateProvider.locationProvider.location,
                language: "en-us"
              }
            }
          )
          .catch(e => {
            console.error(e);
            stateProvider.errorsProvider.setErrors([
              ...stateProvider.errorsProvider.errors,
              "Error fetching related locations"
            ]);
          });
        if (res) {
          if (res.data.length !== 0) {
            res.data.map((location, key) => {
              displayedRelatedLocation =
                location.LocalizedName +
                ", " +
                location.AdministrativeArea.LocalizedName +
                ", " +
                location.Country.LocalizedName;
              relatedLocationsCodes.push(location.Key);
              relatedLocationsNames.push(displayedRelatedLocation);
              relatedLocationsElements.push(
                <div key={key} className={styles.individual_location}>
                  <a
                    onClick={e => {
                      clickedAutocomplete(key);
                    }}
                  >
                    {displayedRelatedLocation}
                  </a>
                </div>
              );
            });
            setRelatedLocationList(relatedLocationsElements);
          }
        }
      }
      getAutocompletedLocationName();
    }
  }, [stateProvider.locationProvider.location]);

  useEffect(() => {
    if (stateProvider.locationCodeProvider.locationCode) {
      async function getForecast() {
        const res = await axios
          .get(
            "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" +
              stateProvider.locationCodeProvider.locationCode,
            {
              params: {
                apikey: process.env.REACT_APP_WEATHER_API_KEY,
                language: "en-us",
                details: false,
                metric: stateProvider.metricUnitProvider.metricUnits
              }
            }
          )
          .catch(e => {
            console.error(e);
            stateProvider.errorsProvider.setErrors([
              ...stateProvider.errorsProvider.errors,
              "Error fetching forecast"
            ]);
          });
        if (res) {
          stateProvider.forecastProvider.setForecast(res.data);
        }
      }
      getForecast();

      if (retriveCurrentLocationObject()) {
        if (fetchFavoriteLocationFromList() !== -1) {
          setFavoritesElement(true);
        } else {
          setFavoritesElement(false);
        }
      }
    }
  }, [
    stateProvider.locationCodeProvider.locationCode,
    stateProvider.favoriteLocationsProvider.favoriteLocations,
    stateProvider.metricUnitProvider.metricUnits
  ]);

  return (
    <div
      className={styles.search_box}
      style={stateProvider.themeStyle.themesStylesWhole}
    >
      <div className={styles.input_seperator}>
        <input
          style={stateProvider.themeStyle.themesStylesText}
          ref={searchBarEl}
          className={styles.search_text}
          type="text"
          placeholder={stateProvider.selectedLocationProvider.selectedLocation}
          onChange={e => {
            stateProvider.lastLocationSearchProvider.setLastLocationSearch(
              e.target.value
            );
          }}
        />

        <div className={styles.search_related_locations}>
          {relatedLocationList}
        </div>
      </div>

      <div
        className={styles.search_button}
        onClick={e => {
          if (
            stateProvider.lastLocationSearchProvider.lastLocationSearch.toString()
              .length > 0
          ) {
            let formated_searched_location_array =
              stateProvider.lastLocationSearchProvider.lastLocationSearch;
            formated_searched_location_array = formated_searched_location_array
              .toLowerCase()
              .split(" ");
            let formated_searched_location = "";
            for (
              let index = 0;
              index < formated_searched_location_array.length;
              index++
            ) {
              formated_searched_location_array[index] =
                formated_searched_location_array[index]
                  .charAt(0)
                  .toUpperCase() +
                formated_searched_location_array[index].substring(1);
            }
            formated_searched_location = formated_searched_location_array.join(
              " "
            );
            stateProvider.locationProvider.setLocation(
              formated_searched_location
            );
          }
        }}
      >
        <FontAwesomeIcon
          icon={faSearchLocation}
          style={stateProvider.themeStyle.themesStylesText}
        />
      </div>

      {retriveCurrentLocationObject() ? (
        favoritesElement ? (
          <div
            className={styles.add_to_favorites}
            style={{ color: "#c0392b" }}
            onClick={() => {
              if (retriveCurrentLocationObject()) {
                tempFavoriteArray = [
                  ...stateProvider.favoriteLocationsProvider.favoriteLocations
                ];
                var removeableIndex = fetchFavoriteLocationFromList();
                if (removeableIndex != -1) {
                  console.log(tempFavoriteArray[removeableIndex]);
                  tempFavoriteArray.splice(removeableIndex, 1);
                  stateProvider.favoriteLocationsProvider.setFavoriteLocations([
                    ...tempFavoriteArray
                  ]);
                  tempFavoriteArray = [];
                }
              }
            }}
          >
            <FontAwesomeIcon icon={faMinusCircle} />
          </div>
        ) : (
          <div
            className={styles.add_to_favorites}
            style={{ color: "#2980b9" }}
            onClick={() => {
              if (retriveCurrentLocationObject()) {
                stateProvider.favoriteLocationsProvider.setFavoriteLocations([
                  ...stateProvider.favoriteLocationsProvider.favoriteLocations,
                  retriveCurrentLocationObject()
                ]);
              }
            }}
          >
            <FontAwesomeIcon icon={faPlusCircle} />
          </div>
        )
      ) : (
        <div></div>
      )}
    </div>
  );

  function clickedAutocomplete(key) {
    stateProvider.selectedLocationProvider.setSelectedLocation(
      relatedLocationsNames[key]
    );
    stateProvider.locationCodeProvider.setLocationCode(
      relatedLocationsCodes[key]
    );
    searchBarEl.current.value = relatedLocationsNames[key];
    setRelatedLocationList([]);
  }

  function fetchFavoriteLocationFromList() {
    let keyIndex = -1;
    if (retriveCurrentLocationObject()) {
      stateProvider.favoriteLocationsProvider.favoriteLocations.map(
        (location, key) => {
          if (
            location.locationCode ===
              retriveCurrentLocationObject().locationCode &&
            location.locationName ===
              retriveCurrentLocationObject().locationName
          ) {
            keyIndex = key;
          }
        }
      );
    }
    return keyIndex;
  }

  function retriveCurrentLocationObject() {
    if (
      stateProvider.locationCodeProvider.locationCode &&
      stateProvider.selectedLocationProvider.selectedLocation
    ) {
      return {
        locationCode: stateProvider.locationCodeProvider.locationCode,
        locationName: stateProvider.selectedLocationProvider.selectedLocation
      };
    }
  }
}

export default SearchBar;
