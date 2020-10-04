import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const classes = {
  div: {
    textAlign: "center",
  },
  login: {
    textAlign: "center",
    paddingTop: "5vh",
  },
  error: {
    color: "red",
    margin: "0px 0px -14px",
    fontSize: "10px",
  },
  p: {
    fontWeight: "600",
  },
};

function WelcomePage(props) {
  let [name, setName] = useState("Anonymous");
  let [isFormValid, setIsFormValid] = useState(true);
  let history = useHistory();

  const callStart = () => {
    console.debug("User Name >>> ", name);
    props.getUserName(name);
    history.push("/arrangeShip"); //redirect to next page
  };

  const handleChange = (event) => {
    setName(event.target.value);

    if (!event.target.value) {
      setIsFormValid(false);
    } else if (event.target.value.match(/^[a-zA-Z0-9\-_\s]+$/)) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  return (
    <>
      <div style={classes.div}>
        <h1>Battle Ship</h1>
        <p style={classes.p}>
          Welcome to the Battle Ground.
          <br />
          <label>
            Can I call you{" "}
            <input type="text" onChange={handleChange} value={name}></input>
          </label>
          ?
        </p>
        {isFormValid ? (
          <></>
        ) : (
          <p style={classes.error}>We accept only alphanumeric values.</p>
        )}
      </div>
      <div style={classes.login}>
        <button disabled={!isFormValid} onClick={callStart}>
          Start
        </button>
      </div>
    </>
  );
}

export default WelcomePage;
