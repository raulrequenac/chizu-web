import React, { useContext, useEffect, useState } from 'react'
import Async from 'react-select/async'
import { Link } from 'react-router-dom'
import mapboxServices from '../services/MapboxServices'
import LocationsContext from '../contexts/LocationsContext'
import '../styles/Location.css'

const Location = ({ start, userLocations, handleOnChangeStart }) => {
  const { info, locations, setLocations } = useContext(LocationsContext)
  const [print, setPrint] = useState(false)
  let search = []

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
    <div className="Location" style={{ paddingTop: '1rem'}}>
      {print ? locations.map((_, i) => (
            <div className="form-group chooseLoc" key={i}>
              <Async 
                loadOptions= {loadOptions} 
                placeholder= {locations[i] ? locations[i].label : `location ${i+1}`}
                onChange= {(e) => handleOnChange(e, i)}
              />
              <Link to={`/map?index=${i}`} style={{ 
                display: 'flex',
                width: '50px',
                marginLeft: '10px',
                alignItems: 'center',
                justifyContent: 'center' }}
              >
                <img alt="marker-icon" src="/images/maps-and-flags.svg" style={{ width: '25px' }}/>
                </Link>
              <a type="button" href="#" onClick={() => onClickDeleteStop(i)}
                style={{ 
                  display: 'flex',
                  width: '40px',
                  alignItems: 'center',
                  justifyContent: 'center' }}
                >
                <img alt="marker-icon" src="/images/bin.svg" style={{ width: '25px' }}/>
              </a>
              <a type="button" href="#"  onClick={() => handleOnChangeStart(i)}
              style={{ 
                display: 'flex',
                width: '60px',
                alignItems: 'center',
                justifyContent: 'center' }}
              >
              <img 
                alt=''
                src={`${start === i ? '/images/flag-active.svg' : '/images/flag-inactive.svg'}`}
                style={{ width: '25px' }}
              />
              </a>
             
            </div>
          )) : <></>}
    </div>
  )
}

export default Location
