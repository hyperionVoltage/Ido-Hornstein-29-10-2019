import React, { useEffect, useContext, useState } from "react";
import {
  /*BrowserRouter as Router*/ HashRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import styles from "../Styles/header.module.css";
import Index from "../Routes/Index";
import Favorites from "../Routes/Favorites";
import Error from "../Components/Error";
import { StateContext } from "../Context/StateContext";

function Header() {
  const stateProvider = useContext(StateContext);

  const [currentErrors, setCurrentErrors] = useState();

  var errorList = [];

  useEffect(() => {
    if (stateProvider.errorsProvider.errors) {
      stateProvider.errorsProvider.errors.map((error, key) => {
        errorList.push(<Error key={key} errorText={error} />);
      });
      setCurrentErrors([...errorList]);
    }
  }, [stateProvider.errorsProvider]);

  let logoText = "Weather App By Ido";

  return (
    <HashRouter>
      <header
        className={styles.header}
        style={stateProvider.themeStyle.themesStylesWhole}
      >
        {logoText}
        <div className={styles.error_starter}>{currentErrors}</div>
        <div
          className={styles.unit_changer}
          onClick={() => {
            if (stateProvider.metricUnitProvider.metricUnits) {
              stateProvider.metricUnitProvider.setMetricUnits(false);
            } else {
              stateProvider.metricUnitProvider.setMetricUnits(true);
            }
          }}
        >
          {stateProvider.metricUnitProvider.metricUnits
            ? "Units: C"
            : "Units: F"}
        </div>
        <div
          className={styles.theme_changer}
          onClick={() => {
            if (stateProvider.themeProvider.lightTheme) {
              stateProvider.themeProvider.setLightTheme(false);
            } else {
              stateProvider.themeProvider.setLightTheme(true);
            }
          }}
        >
          Theme: {stateProvider.themeProvider.lightTheme ? "Light" : "Dark"}
        </div>
        <nav>
          <ul className={styles.nav_links}>
            <li className={styles.nav_link}>
              <Link
                className={styles.link}
                to="/"
                style={stateProvider.themeStyle.themesStylesWhole}
              >
                Home
              </Link>
            </li>
            <li className={styles.nav_link}>
              <Link
                className={styles.link}
                to="/favorites"
                style={stateProvider.themeStyle.themesStylesWhole}
              >
                Favorites
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <Switch>
        <Route path="/favorites">
          <Favorites />
        </Route>
        <Route path="/">
          <Index />
        </Route>
      </Switch>
    </HashRouter>
  );
}

export default Header;
