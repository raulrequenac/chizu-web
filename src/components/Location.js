import React, { useContext, useEffect, useState } from 'react'
import Async from 'react-select/async'
import { Link } from 'react-router-dom'
import mapboxServices from '../services/MapboxServices'
import LocationsContext from '../contexts/LocationsContext'

const Location = ({ locationValues }) => {
  const {start, locations, userLocations, setLocations, handleOnChangeStart} = locationValues
  const { info } = useContext(LocationsContext)
  const [print, setPrint] = useState(false)
  let search = {}

  useEffect(() => {
    setPrint(true)
  }, [info])

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
      {print ? locations.map((_, i) => (
            <div className="form-group" key={i}>
              <Async 
                loadOptions= {loadOptions} 
                placeholder= {info.locations[i] ? info.locations[i].label : `location ${i+1}`}
                onChange= {(e) => handleOnChange(e, i)}
              />
              <Link to={`/map?index=${i}`} className="btn btn-primary" >Seleccionar en el mapa</Link>
              <button type="button" className="btn btn-danger" onClick={() => onClickDeleteStop(i)}>Borrar parada</button>
              <input 
                type="checkbox" 
                checked={start === i ? true : false} 
                onChange={() => handleOnChangeStart(i)}
              />
            </div>
          )) : <></>}
    </div>
  )
}

export default Location
