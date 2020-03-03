import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom'
import Login from './Login';
import '../styles/App.css'
import Brand from './Brand';
import Home from './Home';
import Map from './Map'
import Locations from './Locations';
import BestPath from './BestPath';
import Register from './Register';

const App = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={loading ? Brand : Home}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/map" component={Map}/>
        <Route exact path="/locations" component={Locations}/>
        <Route exact path="/best-path" component={BestPath}/>
      </Switch>
    </div>
  );
}

export default App;
