import React, { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import WelcomePage from "./components/Welcome";
import Error from "./components/Error";

const App = () => {
  let [userName, setUserName] = useState("");

  const getUserName = (name) => {
    setUserName(name);
    console.debug('User Name App Component >>', userName);
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
          <Route path="/**" component={() => <Error />} />
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default App;
