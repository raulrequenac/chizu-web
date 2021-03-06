import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../contexts/AuthContext'
import LocationsContext from '../contexts/LocationsContext'
import Location from './Location'
import { Redirect } from 'react-router-dom'
import '../styles/Locations.css'
import queryString from 'query-string'

const Locations = () => {
  const { setInfo, locations, setLocations } = useContext(LocationsContext)
  const { currentUser } = useContext(AuthContext)
  const [userLocations, setUserLocations] = useState([])
  const [limit, setLimit] = useState(1)
  const [start, setStart] = useState(null)
  const [redirect, setRedirect] = useState(false)
  const [error, setError] = useState(false)
  const [toHome, setToHome] = useState(false)
  const [show, setShow] = useState(locations && locations.length>3 ? locations.length : 3)
  const parse = queryString.parse(window.location.search)

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
    if (currentUser && currentUser.locations) {
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
    setLimit(locations.length)
  }, [locations])

  useEffect(() => {
    if (locations[parse.index] && parse.value !== locations[parse.index].value) {
      let newLocations = [...locations]
      newLocations[parse.index] = {
        value: parse.value,
        label: parse.label,
        coordinates: [parse.lng, parse.lat]
      }
      setLocations(newLocations)
      setLocations([...newLocations.filter(loc => loc)])
    }
  }, [parse, locations, setLocations])

  useEffect(() => {
    return () => setRedirect(false)
  }, [])

  const handleOnChangeLimit = (event) => setLimit(event.target.value)

  const handleOnChangeStart = (location) => locations[location] && start===location ? setStart(null) : setStart(location)

  const onClickHome = () => setToHome(true)

  const onClickAddLocation = () => {
    if (locations.length === show) setShow(show+1)
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    setInfo({
      limit: limit,
      start: start
    })
    setRedirect(true)
  }

  if (toHome) return <Redirect to="/"/>

  return (
    <div className="Locations">
      {redirect ? <Redirect push to='/best-path'/> : <div>
        <div className="error" style={{display: `${error ? '' : 'none'}`}}>
          <p>There is no route available.</p>
        </div>
        <div className="title-container" onClick={onClickHome}>
          <img alt="marker-icon" src="/images/map.svg" width="125px"/>
          <h1 className="title"><strong>Encuentra tu camino</strong> eligiendo tus destinos</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="limit"> 
            <h5 className="limit-title">Elige un límite:</h5>
            <select value={locations.length} onChange={handleOnChangeLimit} className="select-limit">
              {locations.length ? locations.map((_, i) => 
                <option value={i+1} key={i}>{i+1}</option>) : 
                <option value={0} key={0}>{0}</option>
              }
            </select>
          </div>
          <div className="separator">
            <hr></hr>
          </div>
          <Location 
            start={start} 
            userLocations={userLocations} 
            handleOnChangeStart={handleOnChangeStart} 
            show={show}
            setShow={setShow}
            />
          <div className="buttons">
            <div className={`addLocation ${locations.length === show ? '' : 'disabled'}`} onClick={onClickAddLocation}>
              <img alt="" src="/images/add.svg" className="addLogo"/>
            </div>
            <button type="submit" className={`submit-button ${locations.length<2 ? 'disabled' : ''}`}>GO!</button>
          </div>
        </form>
      </div>
      }
    </div>
  )
}

export default Locations
