import React, { Suspense, useState, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import FastForwardIcon from "@material-ui/icons/FastForward";
import ShipImage from "../assets/images/sub-ship-image.svg";

const ArrangeShipCanvas = React.lazy(() =>
  import("./canvas/ArrangeShipCanvas")
);

const classes = {
  h1: {
    textAlign: "center",
    paddingTop: "0px",
  },
  h4: {
    padding: "0",
    margin: "0",
  },
  arrange: {
    paddingTop: "5vh",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  progress: {
    display: "flex",
    justifyContent: "center",
  },
  div: {
    textAlign: "center",
  },
  span: {
    fontWeight: "800",
  },
};

function ArrangeShips(props) {
  const [hasClickedArranged, setHasClickedArranged] = useState(false);
  const [timer, setTimer] = useState(15);

  useEffect(() => {
    if (timer > -1) {
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    }
  }, [timer]);

  useEffect(() => {
    if (!hasClickedArranged) {
      setTimeout(() => {
        setHasClickedArranged(true);
      }, 15000);
    }
  }, [hasClickedArranged]);

  const callStart = () => {
    setHasClickedArranged(true);
  };

  const Introduction = () => {
    return (
      <div style={classes.div}>
        <h1 style={classes.h1}>Hello Captain {props.userName} !</h1>
        <img className="arrange-ship-img" src={ShipImage} alt="ship" />
        <p className="arrange-p">
          We have to capture Indian Ocean from Captain{" "}
          <span style={classes.span}>Amy Dunne</span>.
        </p>
        <p className="arrange-p">
          We predict that she & her 7 ships are in this 10 x 10 blocks. Arrange
          your fleet in 10 x 10 blocks. You have 100 Torpedos. Turn off the
          radar & go EMCON. I repeat go radio slient.
        </p>
        <h4 style={classes.h4}>Skip in {timer}s...</h4>
        <Button
          style={classes.button}
          color="primary"
          variant="contained"
          size="large"
          onClick={callStart}
          endIcon={<FastForwardIcon />}
        >
          Skip Now
        </Button>
      </div>
    );
  };

  return (
    <>
      <Suspense
        fallback={
          <div style={classes.progress}>
            <CircularProgress />
          </div>
        }
      >
        {hasClickedArranged ? (
          <>
            <h1 style={classes.h1}>
              Arrange Your Ships Captian {props.userName}
            </h1>
            <ArrangeShipCanvas getGridArray={props.getGridArray} />
          </>
        ) : (
          <Introduction />
        )}
      </Suspense>
    </>
  );
}
export default ArrangeShips;
