import React, { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import WelcomePage from "./components/Welcome";

const App = () => {
  let [userName, setUserName] = useState("");

  const getUserName = (name) => {
    setUserName(name);
    console.debug('User Name App Component >>', name);
  };

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/"
            component={() => <WelcomePage getUserName={getUserName} />}
          />
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default App;
