import React, { useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import '../styles/Header.css'

const Header = ({move}) => {
  const [toHome, setToHome] = useState(false)
  const [toLocations, setToLocations] = useState(false)
  const { goBack } = useHistory()

  if (toHome) return <Redirect to="/"/>
  if (toLocations) return <Redirect to="/locations"/>

  return (
    <nav className="Header navbar fixed-top">
      <img className={`logo navbar-brand ${move ? 'slide-out-right' : ''}`} alt="logo" src="/images/chizu-logo.svg" onClick={goBack} />
    </nav>
  )
}

export default Header
