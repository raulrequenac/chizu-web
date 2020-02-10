import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Header.css'

const Header = ({move}) => {
  return (
    <nav className="Header navbar fixed-top">
      <Link to="/" className="navbar-brand">
        <img className={`logo ${move ? 'slide-out-right' : ''}`} alt="logo" src="/images/chizu-logo.svg"></img>
      </Link>
    </nav>
  )
}

export default Header
