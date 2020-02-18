import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../contexts/AuthContext'
import Header from './Header'
import Location from './Location'
import { Redirect } from 'react-router-dom'

const Locations = ({ setInfo }) => {
  const { currentUser } = useContext(AuthContext)
  const [locations, setLocations] = useState((new Array(8)).fill(null))
  const [userLocations, setUserLocations] = useState([])
  const [limit, setLimit] = useState(1)
  const [start, setStart] = useState(null)
  const [redirect, setRedirect] = useState(false)
  const [realLocations, setRealLocations] = useState([])

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
    return () => setRedirect(false)
  }, [])


  const handleOnChangeLimit = (event) => {
    setLimit(event.target.value)
  }

  const handleOnChangeStart = (location) => {
    if (locations[location]) start === location ? setStart(null) : setStart(location)
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

  return (
    <div className="Locations">
      {redirect ? <Redirect push to='/best-path'/> : <div>
        <Header />
        <form onSubmit={handleSubmit}>
          <Location 
            start = {start}
            locations = {locations}
            realLocations = {realLocations}
            userLocations = {userLocations}
            setLocations = {setLocations}
            handleOnChangeStart = {handleOnChangeStart}
          />
          <select value={limit} onChange={handleOnChangeLimit}>
            {locations.map((_, i) => (
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
