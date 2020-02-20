import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../contexts/AuthContext'
import LocationsContext from '../contexts/LocationsContext'
import Header from './Header'
import Location from './Location'
import { Redirect } from 'react-router-dom'
import '../styles/Locations.css'
import queryString from 'query-string'

const Locations = () => {
  const { info, setInfo } = useContext(LocationsContext)
  const { currentUser } = useContext(AuthContext)
  const [userLocations, setUserLocations] = useState([])
  const [limit, setLimit] = useState(1)
  const [start, setStart] = useState(null)
  const [redirect, setRedirect] = useState(false)
  const [realLocations, setRealLocations] = useState([])
  const [locations, setLocations] = useState([...info.locations, ...((new Array(8-info.locations.length)).fill(null))])
  const parse = queryString.parse(window.location.search)

  useEffect(() => {
    const newOptions = []
    navigator.geolocation.getCurrentPosition((el) => {
      newOptions.push({
        value: 'userLocation', 
        label: 'Tu ubicación', 
        coordinates: [el.coords.longitude, el.coords.latitude]
      })
    })
    if (currentUser) {
      currentUser.locations.map(location => {
        newOptions.push({
          value: location.id, 
          label: location.name, 
          coordinates: location.coordinates
        })
        return location
      })
    }
    
    setUserLocations(newOptions)
  }, [currentUser])

  useEffect(() => {
    setRealLocations([...locations.filter(loc => loc)])
  }, [locations])

  useEffect(() => {
  })

  useEffect(() => {
    return () => setRedirect(false)
  }, [])


  const handleOnChangeLimit = (event) => {
    setLimit(event.target.value)
  }

  const handleOnChangeStart = (location) => {
    locations[location] && start===location ? setStart(null) : setStart(location)
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!realLocations.length){
      alert('You have to choose at least 1 location!')
    } else if (limit > realLocations.length) {
      alert('Limit cant be greater that the number of locations!')
    } else {
      setInfo({
        locations: realLocations,
        limit: limit,
        start: start
      })
      setRedirect(true)
    }
  }

  const locationValues = { start, locations, userLocations, setLocations, handleOnChangeStart}

  return (
    <div className="Locations">
      {redirect ? <Redirect push to='/best-path'/> : <div>
        <Header />
        <form onSubmit={handleSubmit}>
          <Location locationValues={locationValues}/>
          <select value={limit} onChange={handleOnChangeLimit}>
            {realLocations.map((_, i) => (
              <option value={i+1} key={i}>{i+1}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary btn-lg">GO!</button>
        </form>
      </div>
      }
    </div>
  )
}

export default Locations
