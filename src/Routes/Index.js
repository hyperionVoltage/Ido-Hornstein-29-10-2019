import React from "react";
import "../Styles/index.css";
import SearchBar from "../Components/SearchBar";
import SingularLocationWeatherDisplay from "../Components/SingularLocationWeatherDisplay";

function Index() {
  return (
    <div>
      <SearchBar />
      <SingularLocationWeatherDisplay />
    </div>
  );
}

export default Index;
