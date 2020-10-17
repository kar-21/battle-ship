import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";

const classes = {
  div: {
    textAlign: "center",
  },
  login: {
    textAlign: "center",
    paddingTop: "5vh",
  },
  p: {
    fontWeight: "600",
  },
  error: {
    margin: "0px 0px -14px",
    fontSize: "10px",
  },
  label: {
    display: "inline-flex",
    alignItems: "baseline",
  },
  span: {
    marginRight: "5px",
  },
  button: {
    margin: "3%",
    fontWeight: "bolder",
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
          <label style={classes.label}>
            <span style={classes.span}>Can I call you</span>
            <FormControl>
              <Input
                type="text"
                color="primary"
                style={classes.textField}
                size="small"
                error={!isFormValid}
                value={name}
                onChange={handleChange}
              />
              {!isFormValid ? (
                <FormHelperText style={classes.error} error={!isFormValid}>
                  We accept only alphanumeric values.
                </FormHelperText>
              ) : (
                <></>
              )}
            </FormControl>
          </label>
          ?
        </p>
      </div>
      <div style={classes.login}>
        <Button
          style={classes.button}
          color="primary"
          variant="contained"
          size="large"
          disabled={!isFormValid}
          onClick={callStart}
          startIcon={<PlayCircleFilledIcon />}
        >
          Start
        </Button>
      </div>
    </>
  );
}

export default WelcomePage;
