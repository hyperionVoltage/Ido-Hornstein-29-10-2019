import React, { useContext } from "react";
import styles from "../Styles/favoritessearchbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchLocation } from "@fortawesome/free-solid-svg-icons";
import { StateContext } from "../Context/StateContext";

function FavoritesSearchBar() {
  const stateProvider = useContext(StateContext);

  return (
    <div
      className={styles.search_box}
      style={stateProvider.themeStyle.themesStylesWhole}
    >
      <div className={styles.extend_container}>
        <input
          ref={stateProvider.favoriteSearchBarEl}
          className={styles.search_text}
          type="text"
          style={stateProvider.themeStyle.themesStylesText}
          placeholder="Search your favorites"
          onChange={e => {
            stateProvider.searchedFavoritesProvider.setSearchedFavorites(
              e.target.value
            );
          }}
        />
        <div className={styles.search_button}>
          <FontAwesomeIcon icon={faSearchLocation} />
        </div>
      </div>
    </div>
  );
}

export default FavoritesSearchBar;
