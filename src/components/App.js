import React, { useState, useEffect, useContext } from 'react';
import { Switch, Route } from 'react-router-dom'
import Login from './Login';
import '../styles/App.css'
import Brand from './Brand';
import Home from './Home';
import Map from './Map'
import Locations from './Locations';
import BestPath from './BestPath';
import LocationsContext from '../contexts/LocationsContext';

const App = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          {loading ? <Brand/> : <Home/>}
        </Route>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/map" component={Map}/>
        <Route exact path="/locations">
          <Locations/>
        </Route>
        <Route exact path="/best-path">
          <BestPath/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
