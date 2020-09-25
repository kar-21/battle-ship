import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/"
            component={() => <>Battle Ship</>}
          />
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default App;
