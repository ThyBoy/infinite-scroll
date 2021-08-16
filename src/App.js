import { Switch, Route, Redirect } from "react-router";
import Header from "./Components/Header/Header";
import DeleteImg from "./pages/delete/DeleteImg";
import { auth } from "./firebase.utils";
import ViewAllImg from "./pages/viewall/ViewAllImg";
import { useEffect, useState } from "react";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);
  return (
    <div>
      <Header isSignedIn={isSignedIn} />
      <Switch>
        <Route
          exact
          path="/"
          render={() =>
            isSignedIn ? <ViewAllImg /> : <div>Sign In To Access Content.</div>
          }
        />
        <Route
          exact
          path="/delete"
          render={() => (isSignedIn ? <DeleteImg /> : <Redirect to="/" />)}
        />
      </Switch>
    </div>
  );
}

export default App;
