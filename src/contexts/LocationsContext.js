import React, {createContext, useState} from 'react'

const LocationsContext = createContext()

export const LocationsContextProvider = ({ children }) => {
  const [data, setData] = useState(JSON.parse(localStorage.getItem('info')) || {
    locations: [],
    limit: 1,
    start: null
  })
  
  const setInfo = (info) => {
    const newData = {
      locations: data.locations,
      limit: info.limit,
      start: info.start
    }
    setData(newData)
    localStorage.setItem('info', JSON.stringify(newData))
  }

  const setLocations = (locations) => {
    const newData = {
      locations: locations,
      limit: locations.length,
      start: data.start
    }
    setData(newData)
    localStorage.setItem('info', JSON.stringify(newData))
  }

  const value = {
    info: data,
    setInfo,
    locations: data.locations,
    setLocations
  }

  return (
    <LocationsContext.Provider value={value}>
      {children}
    </LocationsContext.Provider>
  )
}

export default LocationsContext
