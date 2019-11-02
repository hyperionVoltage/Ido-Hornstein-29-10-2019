import React, { useContext, useEffect, useState } from "react";
import styles from "../Styles/favorites.module.css";
import FavoritesSearchBar from "../Components/FavoritesSearchBar";
import FavoriteWeatherCard from "../Components/FavoriteWeatherCard";
import { StateContext } from "../Context/StateContext";

function Favorites() {
  const stateProvider = useContext(StateContext);

  const [allFavorites, setAllFavorites] = useState([]);
  const [allDisplayed, setAllDisplayed] = useState([]);

  var allFavoriteArray = [];
  var allDisplayedArray = [];

  useEffect(() => {
    stateProvider.locationProvider.setLocation("");
    stateProvider.searchedFavoritesProvider.setSearchedFavorites("");
    stateProvider.favoriteSearchBarEl.current.value = "";
  }, []);

  useEffect(() => {
    if (stateProvider.favoriteLocationsProvider.favoriteLocations.length >= 0) {
      stateProvider.favoriteLocationsProvider.favoriteLocations.map(
        (favoriteLocation, key) => {
          allFavoriteArray.push(
            <FavoriteWeatherCard
              key={key}
              index={key}
              locationCode={favoriteLocation.locationCode}
              locationName={favoriteLocation.locationName}
            />
          );
        }
      );
      setAllFavorites([...allFavoriteArray]);
    }
  }, [stateProvider.favoriteLocationsProvider.favoriteLocations]);

  useEffect(() => {
    allFavorites.map((location, key) => {
      if (
        location.props.locationName
          .toString()
          .toLowerCase()
          .includes(
            stateProvider.searchedFavoritesProvider.searchedFavorites
              .toString()
              .toLowerCase()
          )
      ) {
        allDisplayedArray.push(location);
      }
      setAllDisplayed([...allDisplayedArray]);
    });
  }, [stateProvider.searchedFavoritesProvider.searchedFavorites]);

  return (
    <div>
      <FavoritesSearchBar />
      <div className={styles.favorite_location_container}>
        {stateProvider.searchedFavoritesProvider.searchedFavorites
          ? allDisplayed
          : allFavorites}
      </div>
    </div>
  );
}

export default Favorites;
