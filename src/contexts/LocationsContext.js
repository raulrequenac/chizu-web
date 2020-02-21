import React, {createContext, useState} from 'react'

const LocationsContext = createContext()

export const LocationsContextProvider = ({ children }) => {
  const [data, setData] = useState(JSON.parse(localStorage.getItem('info')))
  const [locs, setLocs] = useState(data.locations)

  const setLocations = (locations) => setLocs(locations)
  
  const setInfo = (info) => {
    localStorage.setItem('info', info ? 
      JSON.stringify({
        locations: locs,
        limit: info.limit,
        start: info.start
      }) : 
      JSON.stringify({
        locations: (new Array(8)).fill(null), 
        limit: 1, 
        start: null
      }))
    setData(info)
  }

  const value = {
    info: data,
    setInfo,
    locations: locs,
    setLocations
  }

  return (
    <LocationsContext.Provider value={value}>
      {children}
    </LocationsContext.Provider>
  )
}

export default LocationsContext
