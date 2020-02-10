import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom'
import Login from './Login';
import '../styles/App.css'
import Brand from './Brand';
import Home from './Home';
import Map from './Map'

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
        <Route exact path="/map" componet={Map}/>
      </Switch>
    </div>
  );
}

export default App;
