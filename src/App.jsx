import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import WelcomePage from "./components/Welcome";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/"
            component={() => <WelcomePage />}
          />
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default App;
