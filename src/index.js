import React, { Suspense, useState, useMemo, useRef } from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { StateContext } from "./Context/StateContext";

const Header = React.lazy(() => import("./Components/Header"));

const Loading = () => {
  return <div>Currently Loading files</div>;
};

const App = () => {
  const [location, setLocation] = useState();
  const [forecast, setForecast] = useState();
  const [metricUnits, setMetricUnits] = useState(true);
  const [locationCode, setLocationCode] = useState();
  const [selectedLocation, setSelectedLocation] = useState("City Search");
  const [currentWeather, setCurrentWeather] = useState();
  const [favoriteLocations, setFavoriteLocations] = useState([]);
  const [searchedFavorites, setSearchedFavorites] = useState("");
  const [lastLocationSearch, setLastLocationSearch] = useState("");
  const [errors, setErrors] = useState([]);
  const [lightTheme, setLightTheme] = useState(false);
  const [usedGeolocation, setUsedGeolocation] = useState(false);

  const locationProvider = useMemo(() => ({ location, setLocation }), [
    location,
    setLocation
  ]);

  const forecastProvider = useMemo(() => ({ forecast, setForecast }), [
    forecast,
    setForecast
  ]);

  const metricUnitProvider = useMemo(() => ({ metricUnits, setMetricUnits }), [
    metricUnits,
    setMetricUnits
  ]);

  const locationCodeProvider = useMemo(
    () => ({ locationCode, setLocationCode }),
    [locationCode, setLocationCode]
  );

  const selectedLocationProvider = useMemo(
    () => ({ selectedLocation, setSelectedLocation }),
    [selectedLocation, setSelectedLocation]
  );

  const currentWeatherProvider = useMemo(
    () => ({ currentWeather, setCurrentWeather }),
    [currentWeather, setCurrentWeather]
  );

  const favoriteLocationsProvider = useMemo(
    () => ({
      favoriteLocations,
      setFavoriteLocations
    }),
    [favoriteLocations, setFavoriteLocations]
  );

  const searchedFavoritesProvider = useMemo(
    () => ({
      searchedFavorites,
      setSearchedFavorites
    }),
    [searchedFavorites, setSearchedFavorites]
  );

  const lastLocationSearchProvider = useMemo(
    () => ({
      lastLocationSearch,
      setLastLocationSearch
    }),
    [lastLocationSearch, setLastLocationSearch]
  );

  const errorsProvider = useMemo(() => ({ errors, setErrors }), [
    errors,
    setErrors
  ]);

  const themeProvider = useMemo(() => ({ lightTheme, setLightTheme }), [
    lightTheme,
    setLightTheme
  ]);

  const favoriteSearchBarEl = useRef(null);

  const themesStylesWhole = themeProvider.lightTheme
    ? { background: "#ecf0f1", color: "#121212" }
    : { background: "#121212", color: "#ecf0f1" };

  const themesStylesText = themeProvider.lightTheme
    ? { background: "#ecf0f1", color: "#121212" }
    : { background: "#121212", color: "#ecf0f1" };

  const themeStyle = useMemo(() => ({ themesStylesWhole, themesStylesText }), [
    themesStylesWhole,
    themesStylesText
  ]);

  const usedGeolocationProvider = useMemo(
    () => ({ usedGeolocation, setUsedGeolocation }),
    [usedGeolocation, setUsedGeolocation]
  );

  const stateProvider = {
    errorsProvider,
    lastLocationSearchProvider,
    searchedFavoritesProvider,
    favoriteLocationsProvider,
    favoriteLocationsProvider,
    currentWeatherProvider,
    locationProvider,
    forecastProvider,
    metricUnitProvider,
    locationCodeProvider,
    selectedLocationProvider,
    favoriteSearchBarEl,
    themeProvider,
    themeStyle,
    usedGeolocationProvider
  };

  return (
    <Suspense fallback={<Loading />}>
      <StateContext.Provider value={stateProvider}>
        <Header />
      </StateContext.Provider>
    </Suspense>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();
