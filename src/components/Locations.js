import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../contexts/AuthContext'
import LocationsContext from '../contexts/LocationsContext'
import Header from './Header'
import Location from './Location'
import { Redirect } from 'react-router-dom'
import '../styles/Locations.css'
import queryString from 'query-string'

const Locations = () => {
  const { info, setInfo, locations, setLocations } = useContext(LocationsContext)
  const { currentUser } = useContext(AuthContext)
  const [userLocations, setUserLocations] = useState([])
  const [limit, setLimit] = useState(1)
  const [start, setStart] = useState(null)
  const [redirect, setRedirect] = useState(false)
  const [realLocations, setRealLocations] = useState([])
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
    setLimit(realLocations.length)
  }, [realLocations])

  useEffect(() => {
    if (locations[parse.index] && parse.value !== locations[parse.index].value) {
      let newLocations = [...locations]
      newLocations[parse.index] = {
        value: parse.value,
        label: parse.label,
        coordinates: [parse.lng, parse.lat]
      }
      setLocations(newLocations)
      setRealLocations([...newLocations.filter(loc => loc)])
    }
  }, [parse, locations, setLocations])

  useEffect(() => {
    return () => setRedirect(false)
  }, [])

  useEffect(()=> {
    if (!info) setInfo()
  }, [info, setInfo])

  const handleOnChangeLimit = (event) => {
    setLimit(event.target.value)
  }

  const handleOnChangeStart = (location) => {
    locations[location] && start===location ? setStart(null) : setStart(location)
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (realLocations.length < 2){
      alert('You have to choose at least 2 locations!')
    } else if (limit > realLocations.length) {
      alert('Limit cant be greater that the number of locations!')
    } else {
      setInfo({
        limit: limit,
        start: start
      })
      setRedirect(true)
    }
  }

  return (
    <div className="Locations">
      {redirect ? <Redirect push to='/best-path'/> : <div>
        <Header />
        <form onSubmit={handleSubmit}>
          <Location start={start} userLocations={userLocations} handleOnChangeStart={handleOnChangeStart} />
          <select value={limit>=2 ? limit : 0} onChange={handleOnChangeLimit}>
            {realLocations.length ? realLocations.map((_, i) => 
              <option value={i+1} key={i}>{i+1}</option>) : 
              <option value={0} key={0}>{0}</option>
            }
          </select>
          <button type="submit" className={`btn btn-primary btn-lg ${realLocations.length<2 ? 'disabled' : ''}`}>GO!</button>
        </form>
      </div>
      }
    </div>
  )
}

export default Locations
