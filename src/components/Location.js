import React, { useContext, useEffect, useState } from 'react'
import Async from 'react-select/async'
import { Link } from 'react-router-dom'
import mapboxServices from '../services/MapboxServices'
import LocationsContext from '../contexts/LocationsContext'
import '../styles/Location.css'

const Location = ({ start, userLocations, handleOnChangeStart }) => {
  const { info, locations, setLocations } = useContext(LocationsContext)
  const [show, setShow] = useState(locations && locations.length>3 ? locations.length : 3)
  const [print, setPrint] = useState(false)
  let search = []

  useEffect(() => {
    setPrint(true)
  }, [info])

  useEffect(() => {
    setShow(locations.length>3 ? locations.length : 3)
  }, [locations])

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
    let newLocations = [...locations]
    newLocations = [...newLocations.slice(0, pos), ...newLocations.slice(pos+1)]
    setLocations(newLocations)
  }

  const listLocations = () => {
    let locationList = []

    for (let i=0; i<show; i++) {
      locationList.push(
      <div className="form-group chooseLoc" key={i}>
        <Async 
          loadOptions= {loadOptions} 
          placeholder= {locations[i] ? locations[i].label : `Ubicación ${i+1}`}
          onChange= {(e) => handleOnChange(e, i)}
        />
        <Link to={`/map?index=${i}`} className="select-in-map">
          <img alt="marker-icon" src="/images/maps-and-flags.svg"/>
        </Link>
        <div type="button" href="#" onClick={() => onClickDeleteStop(i)} className="delete-location">
          <img alt="marker-icon" src="/images/bin.svg"/>
        </div>
        <div type="button" href="#"  onClick={() => handleOnChangeStart(i)} className='start-location'>
          <img alt='' src={`${start === i && locations[i] ? '/images/flag-active.svg' : '/images/flag-inactive.svg'}`}/>
        </div>
      </div>
    )}
    return locationList
  }

  const onClickAddLocation = () => {
    if (locations.length === show) setShow(show+1)
  }

  return (
    <div className="Location" style={{ paddingTop: '1rem'}}>
      {print ? <div>
        {listLocations()}
        <div className="addLocation" onClick={onClickAddLocation}>
          <img alt="" src="/images/add.svg" width="35px"/>
        </div>
      </div> : <></>}
    </div>
  )
}

export default Location
