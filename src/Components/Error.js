import React, { useContext } from "react";
import styles from "../Styles/errors.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { StateContext } from "../Context/StateContext";

function Error(props) {
  const stateProvider = useContext(StateContext);

  var errorList = [];

  return (
    <div
      className={styles.error_container}
      style={stateProvider.themeStyle.themesStylesWhole}
    >
      <div className={styles.error_text}>{props.errorText}</div>
      <div
        className={styles.error_dismiss_button}
        onClick={() => {
          errorList = stateProvider.errorsProvider.errors;
          errorList.splice(props.key, 1);
          stateProvider.errorsProvider.setErrors([...errorList]);
        }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </div>
    </div>
  );
}

export default Error;
