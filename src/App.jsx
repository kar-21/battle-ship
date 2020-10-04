import React, { useState, useCallback, useEffect } from "react";
import { Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
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
  const [isLandScape, setIsLandScape] = useState(
    window.screen.width > window.screen.height
  );
  const handle = useFullScreenHandle();

  useEffect(() => {
    const handleResize = () => {
      const landscape = window.screen.width > window.screen.height;
      if (landscape !== isLandScape) {
        setIsLandScape(landscape);
      }
    };
    window.addEventListener("resize", handleResize);
  });

  useEffect(() => {
    const handleResize = () => {
      const landscape = window.screen.width > window.screen.height;
      if (landscape !== isLandScape) {
        setIsLandScape(landscape);
      }
    };
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isLandScape]);

  const getUserName = (name) => {
    setUserName(name);
    console.debug("User Name App Component >>", userName);
  };

  const getGridArray = (gridArray) => {
    setGridArray(gridArray);
  };

  const reportChange = useCallback((state, handle) => {
    setIsFullscreen(state);
  }, []);

  return (
    <>
      <div style={classes.fullscreenDiv}>
        <span style={classes.fullscreenText}>
          For better experince we want you to use this application in fullscreen
          mode{" "}
          {isLandScape ? (
            <></>
          ) : (
            <span>
              and we support landscape mode. Please Rotate your screen
            </span>
          )}
          .
        </span>
        <button
          style={classes.fullscreenButton}
          onClick={handle.enter}
          disabled={!isLandScape}
        >
          Enter FullScreen
        </button>
      </div>
      <FullScreen handle={handle} onChange={reportChange}>
        {isFullscreen ? (
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
                    <ArrangeShips
                      userName={userName}
                      getGridArray={getGridArray}
                    />
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
        ) : (
          <></>
        )}
      </FullScreen>
    </>
  );
};

export default App;
