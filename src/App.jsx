import React, { useState, useCallback } from "react";
import { Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import DeviceOrientation, { Orientation } from "react-screen-orientation";
import Button from "@material-ui/core/Button";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";

import "./App.scss";

const Welcome = React.lazy(() => import("./components/Welcome"));
const ArrangeShips = React.lazy(() => import("./components/ArrangeShip"));
const Error = React.lazy(() => import("./components/Error"));
const BattleGround = React.lazy(() => import("./components/BattleGround"));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#5a5a5a",
    },
    secondary: {
      main: "#EF1212",
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    background: {
      default: "#f8f8f8",
    },
  },
  typography: {
    fontFamily: ["Verdana", "Arial", "Helvetica", "sans-serif"].join(","),
  },
});

const classes = {
  fullscreenDiv: {
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    flexDirection: "column",
  },
  fullscreenButton: {
    margin: "3%",
    fontWeight: "bolder",
  },
  fullscreenText: {
    marginRight: "6%",
    marginLeft: "6%",
    fontWeight: "600",
  },
  progress: {
    display: "flex",
    justifyContent: "center",
  },
};

const App = () => {
  const [userName, setUserName] = useState("");
  const [gridArray, setGridArray] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handle = useFullScreenHandle();

  const getUserName = (name) => {
    setUserName(name);
  };

  const getGridArray = (gridArray) => {
    setGridArray(gridArray);
  };

  const reportChange = useCallback((state, handle) => {
    setIsFullscreen(state);
  }, []);

  const RoutingComponents = () => (
    <Suspense
      fallback={
        <div style={classes.progress}>
          <CircularProgress />
        </div>
      }
    >
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/"
            component={() => <Welcome getUserName={getUserName} />}
          />
          <Route
            exact
            path="/arrangeShip"
            component={() => (
              <ArrangeShips userName={userName} getGridArray={getGridArray} />
            )}
          />
          <Route
            exact
            path="/battleGround"
            component={() => (<BattleGround userName={userName}  gridArray={gridArray} />)}
          />
          <Route path="/**" component={() => <Error />} />
        </Switch>
      </BrowserRouter>
    </Suspense>
  );

  const EnterFullScreenText = () => (
    <div style={classes.fullscreenDiv}>
      <span style={classes.fullscreenText}>
        For better experince we want you to use this application in fullscreen
        mode.
      </span>
      <Button
        style={classes.fullscreenButton}
        color="primary"
        variant="contained"
        size="large"
        onClick={handle.enter}
        startIcon={<FullscreenIcon />}
      >
        Enter FullScreen
      </Button>
    </div>
  );
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Typography component={"span"} variant={"body2"}>
          <EnterFullScreenText />
          <FullScreen handle={handle} onChange={reportChange}>
            <DeviceOrientation
              lockOrientation={"landscape"}
              className="orientation"
            >
              <Orientation orientation="landscape" alwaysRender={false}>
                {isFullscreen ? <RoutingComponents /> : <></>}
              </Orientation>
              <Orientation orientation="portrait" alwaysRender={false}>
                <div style={classes.fullscreenDiv}>
                  <span style={classes.fullscreenText}>
                    Please rotate your device
                  </span>
                </div>
              </Orientation>
            </DeviceOrientation>
          </FullScreen>
        </Typography>
      </ThemeProvider>
    </>
  );
};

export default App;
