import React, {createContext, useState} from 'react'

const LocationsContext = createContext()

export const LocationsContextProvider = ({ children }) => {
  const [data, setData] = useState(JSON.parse(localStorage.getItem('info')))
  
  const setInfo = (info) => {
    localStorage.setItem('info', info ? JSON.stringify(info) : JSON.stringify({locations:[], limit:1, start:null}))
    setData(info)
  }

  const value = {
    info: data,
    setInfo
  }

  return (
    <LocationsContext.Provider value={value}>
      {children}
    </LocationsContext.Provider>
  )
}

export default LocationsContext
