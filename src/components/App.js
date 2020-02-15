import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom'
import Login from './Login';
import '../styles/App.css'
import Brand from './Brand';
import Home from './Home';
import Map from './Map'
import Locations from './Locations';
import BestPath from './BestPath';

const App = () => {
  const [loading, setLoading] = useState(true)
  const [info, setInfo] = useState({})

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
          <Locations setInfo={setInfo}/>
        </Route>
        <Route exact path="/best-path">
          <BestPath info={info}/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
