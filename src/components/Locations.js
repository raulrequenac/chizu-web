import React, { useState, useEffect, useContext } from 'react'
import Async from 'react-select/async'
import Header from './Header'
import mapboxServices from '../services/MapboxServices'
import AuthContext from '../contexts/AuthContext'
import { Link, Redirect } from 'react-router-dom'

const Locations = ({ setInfo }) => {
  const { currentUser } = useContext(AuthContext)
  const [locations, setLocations] = useState((new Array(8)).fill(null))
  const [userLocations, setUserLocations] = useState([])
  const [search, setSearch] = useState([])
  const [limit, setLimit] = useState(1)
  const [start, setStart] = useState(null)
  const [redirect, setRedirect] = useState(false)
  const [realLocations, setRealLocations] = useState([])

  useEffect(() => {
    if (currentUser) {
      const newOptions = [...userLocations, ]
      navigator.geolocation.getCurrentPosition((el) => {
        newOptions.add({value: 'userLocation', label: 'Tu ubicación', coordinates: [el.coords.longitude, el.coords.latitude]})
      })
      currentUser.locations.map(location => {
        newOptions.add({value: location.id, label: location.name, coordinates: location.coordinates})
        return location
      })
      setUserLocations(newOptions)
    }
  }, [currentUser])

  useEffect(() => {
    setRealLocations([...locations.filter(loc => loc)])
  }, [locations])

  useEffect(() => {
    return setRedirect(false)
  }, [])

  const handleOnChange = (option, pos) => {
    console.log('other', search)
    const newLocations = [...locations]
    const location = userLocations.find(el => el.value === option.value) ||
      search.find(el => el.value === option.value) ||
      null
    newLocations[pos] = location
    setLocations(newLocations)
  }

  const handleOnChangeLimit = (event) => {
    setLimit(event.target.value)
  }

  const handleOnChangeStart = (location) => {
    if (locations[location]) start === location ? setStart(null) : setStart(location)
  }

  const onClickDeleteStop = (pos) => {
    const newLocations = [...locations]
    newLocations[pos] = null

    setLocations(newLocations)
    handleOnChange('', pos)
  }

  const loadOptions = (query) => {
    setSearch({})
    return mapboxServices.searchLocation(query)
      .then(response => {
        setSearch(response.data.features.map(feat => ({
          value: feat.id,
          label: feat.place_name,
          coordinates: feat.geometry.coordinates
        })))

        while (search === {}) {}

        console.info('search', search)
        
        return [
          ...userLocations.map(option => ({value: option.value, label: option.label})),
          ...search
        ]
      })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()

    console.log(realLocations)
    
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
      {redirect ? <Redirect to='/best-path'/> : 
      <div>
        <Header />
        <form onSubmit={handleSubmit}>
          {locations.map((_, i) => (
            <div className="form-group" key={i}>
              <Async 
                loadOptions= {loadOptions} 
                placeholder= {`location ${i+1}`}
                onChange= {(e) => handleOnChange(e, i)}
              />
              <Link to='/map' className="btn btn-primary">Seleccionar en el mapa</Link>
              <button className="btn btn-danger" onClick={() => onClickDeleteStop(i)}>Borrar parada</button>
              <input 
                type="checkbox" 
                checked={start === i ? true : false} 
                onChange={() => handleOnChangeStart(i)}
              />
            </div>
          ))}
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
