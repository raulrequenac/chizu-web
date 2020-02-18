import React from 'react'
import Async from 'react-select/async'
import { Link } from 'react-router-dom'
import mapboxServices from '../services/MapboxServices'

const Location = ({start, locations, userLocations, setLocations, handleOnChangeStart}) => {
  let search = {}

  const loadOptions = (query) => {
    return mapboxServices.searchLocation(query)
      .then(response => {
        const features = response.data.features
        search = features.map(feat => ({
          value: feat.id,
          label: feat.place_name,
          coordinates: feat.geometry.coordinates
        }))

        return [
          ...userLocations.map(option => ({value: option.value, label: option.label})),
          ...features.map(feat => ({value: feat.id, label: feat.place_name}))
        ]
      })
  }

  const handleOnChange = (option, pos) => {
    const newLocations = [...locations]
    const location = userLocations.find(el => el.value === option.value) ||
      search.find(el => el.value === option.value) ||
      null
    newLocations[pos] = location
    setLocations(newLocations)
  }

  const onClickDeleteStop = (pos) => {
    const newLocations = [...locations]
    newLocations[pos] = null

    setLocations(newLocations)
    handleOnChange('', pos)
  }

  return (
    <div className="Location">
      {locations.map((location, i) => (
            <div className="form-group" key={i}>
              <Async 
                loadOptions= {loadOptions} 
                placeholder= {location || `location ${i+1}`}
                onChange= {(e) => handleOnChange(e, i)}
              />
              <Link to='/map' className="btn btn-primary">Seleccionar en el mapa</Link>
              <button type="button" className="btn btn-danger" onClick={() => onClickDeleteStop(i)}>Borrar parada</button>
              <input 
                type="checkbox" 
                checked={start === i ? true : false} 
                onChange={() => handleOnChangeStart(i)}
              />
            </div>
          ))}
    </div>
  )
}

export default Location
