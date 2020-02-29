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
  const [error, setError] = useState(false)

  useEffect(() => {
    if (parse.error) setError(true)
    const interval = setTimeout(() => setError(false), 3000)

    return () => clearTimeout(interval)
  }, [parse.error])

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
        <div className="error" style={{display: `${error ? '' : 'none'}`}}>
          <p>There is no route available.</p>
        </div>
        <div>
          <img alt="marker-icon" src="/images/map.svg" style={{ width: '100px' }}/>

          <h1 style={{ 
            color: '#22606e',
            fontWeight: 200,
            fontSize: '1.7rem',
            padding: '1rem'
          }}>
            <strong> Build your trip</strong>, by choosing some locations!
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ 
              width: '100%', 
              display: 'flex',
              padding: '0rem 1rem',
              alignItems: 'baseline'
              }}> 
            <h5 style={{ marginBottom: '0',  color: '#22606e', fontWeight: 300}}>Set yor limit!: </h5>
            <select value={limit>=2 ? limit : 0} onChange={handleOnChangeLimit} className="col-3"
              style={{
                appearance: 'menulist'
              }}>
              {realLocations.length ? realLocations.map((_, i) => 
                <option value={i+1} key={i}>{i+1}</option>) : 
                <option value={0} key={0}>{0}</option>
              }
            </select>
            </div>
            <div  style={{ padding: '0rem 1rem'}}>
              <hr></hr>
            </div>
          <Location start={start} userLocations={userLocations} handleOnChangeStart={handleOnChangeStart} />
          <button type="submit" className={`btn btn-primary btn-lg ${realLocations.length<2 ? 'disabled' : ''}`}>GO!</button>
        </form>
      </div>
      }
    </div>
  )
}

export default Locations
