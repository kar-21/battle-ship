import React, { useState } from "react";

const classes = {
  div: {
    textAlign: "center",
    paddingTop: "29vh",
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
};

function WelcomePage(props) {
  let [name, setName] = useState("Anonymous");
  let [isFormValid, setIsFormValid] = useState(true);

  const callStart = () => {
    console.log("User Name >>> ", name);
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
        <h5>
          Welcome to the Battle Ground.
          <br />
          Can I call you <input onChange={handleChange} value={name}></input> ?
        </h5>
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
