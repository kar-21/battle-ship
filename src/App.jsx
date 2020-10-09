import React, { useState, useCallback } from "react";
import { Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import DeviceOrientation, { Orientation } from "react-screen-orientation";
import "./App.scss";

const Welcome = React.lazy(() => import("./components/Welcome"));
const ArrangeShips = React.lazy(() => import("./components/ArrangeShip"));
const Error = React.lazy(() => import("./components/Error"));

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
  },
  fullscreenText: {
    marginRight: "6%",
    marginLeft: "6%",
  },
};

const App = () => {
  const [userName, setUserName] = useState("");
  const [gridArray, setGridArray] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handle = useFullScreenHandle();

  const getUserName = (name) => {
    setUserName(name);
    console.debug("User Name App Component >>", userName);
  };

  const getGridArray = (gridArray) => {
    setGridArray(gridArray);
  };

  const reportChange = useCallback((state, handle) => {
    console.log(">>>", state);
    setIsFullscreen(state);
  }, []);

  const RoutingComponents = () => (
    <Suspense fallback={<div>Loading...</div>}>
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
            component={() => <div>{gridArray}</div>}
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
      <button style={classes.fullscreenButton} onClick={handle.enter}>
        Enter FullScreen
      </button>
    </div>
  );
  return (
    <>
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
    </>
  );
};

export default App;
