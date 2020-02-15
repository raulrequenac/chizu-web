import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import '../styles/Header.css'

const Header = ({move}) => {
  const [toHome, setToHome] = useState(false)

  const handleOnClick = () => {
    if (!["/", "/map"].includes(window.location.pathname)) {
      setToHome(true)
    }
  }

  if (toHome) {
    return <Redirect to="/"/>
  }

  return (
    <nav className="Header navbar fixed-top">
      <img className={`logo navbar-brand ${move ? 'slide-out-right' : ''}`} alt="logo" src="/images/chizu-logo.svg" onClick={handleOnClick} />
    </nav>
  )
}

export default Header
