import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import AvatarOne from "../assets/icons/avatar-1.svg";
import AvatarTwo from "../assets/icons/avatar-2.svg";
import AvatarThree from "../assets/icons/avatar-3.svg";
import AvatarFour from "../assets/icons/avatar-4.svg";

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
  imgContainer: {
    marginTop: "3vh",
    height: "20vh",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
  },
  img: {
    marginTop: "0vh",
    height: "55vh",
  },
};

function WelcomePage(props) {
  let [name, setName] = useState("");
  let [avatar, setAvatar] = useState(1);
  let [isFormValid, setIsFormValid] = useState(true);
  let [isFormTouched, setFormTouched] = useState(false);
  let history = useHistory();

  const callStart = () => {
    console.debug("User Name >>> ", name);
    props.getUserName(name);
    props.getAvatar(avatar);
    history.push("/arrangeShip"); //redirect to next page
  };

  const handleChange = (event) => {
    setName(event.target.value);
    if (!isFormTouched) {
      setFormTouched(true);
    }
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
        <div style={classes.p}>
          Welcome to the Battle Ground.
          <br />
          <label style={classes.label}>
            <span style={classes.span}>Can I call you Captain</span>
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
        </div>
        <div style={classes.imgContainer}>
          <img
            style={classes.img}
            className={avatar !== 1 ? "avatar-transistion" : ""}
            src={AvatarOne}
            onClick={() => setAvatar(1)}
            alt="avathar1"
          />
          <img
            style={classes.img}
            className={avatar !== 2 ? "avatar-transistion" : ""}
            src={AvatarTwo}
            onClick={() => setAvatar(2)}
            alt="avathar2"
          />
          <img
            style={classes.img}
            className={avatar !== 3 ? "avatar-transistion" : ""}
            src={AvatarThree}
            onClick={() => setAvatar(3)}
            alt="avathar3"
          />
          <img
            style={classes.img}
            className={avatar !== 4 ? "avatar-transistion" : ""}
            src={AvatarFour}
            onClick={() => setAvatar(4)}
            alt="avathar4"
          />
        </div>
      </div>
      <div style={classes.login}>
        <Button
          style={classes.button}
          color="primary"
          variant="contained"
          size="large"
          disabled={!isFormValid || !isFormTouched}
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
