import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
// import * as spotActions from "./store/spots";
import SpotsList from "./components/Spots";
import SingleSpot from "./components/SingleSpot";
import CreateNewSpot from "./components/CreateNewSpot";
import ManageSpots from "./components/ManageSpots";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <SpotsList />
          </Route>
          <Route exact path="/api/spots/new">
            <CreateNewSpot />
          </Route>
          <Route exact path="/api/spots/current">
            <ManageSpots />
          </Route>
          <Route exact path="/api/spots/:spotId">
            <SingleSpot />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
