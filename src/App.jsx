import React, { useState } from "react";
import { Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.scss";

const Welcome = React.lazy(() => import("./components/Welcome"));
const ArrangeShips = React.lazy(() => import("./components/ArrangeShip"));
const Error = React.lazy(() => import("./components/Error"));

const App = () => {
  let [userName, setUserName] = useState("");
  let [gridArray, setGridArray] = useState([]);

  const getUserName = (name) => {
    setUserName(name);
    console.debug("User Name App Component >>", userName);
  };

  const getGridArray = (gridArray) => {
    setGridArray(gridArray);
  };

  return (
    <>
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
    </>
  );
};

export default App;
