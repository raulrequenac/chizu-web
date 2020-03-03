import React, { useState, useContext } from 'react'
import { Redirect, useHistory, Link } from 'react-router-dom'
import '../styles/Header.css'
import ChizuServices from '../services/ChizuServices'
import AuthContext from '../contexts/AuthContext'

const Header = ({move}) => {
  const { logout } =  ChizuServices
  const { setUser, currentUser } = useContext(AuthContext)
  const [toHome, setToHome] = useState(false)
  const [toLocations, setToLocations] = useState(false)
  const { goBack } = useHistory()
  const [dropdownMenu, setDropdownMenu] = useState(true)
  const [dropdownContent, setDropdownContent] = useState(false)
  const path = window.document.location.pathname

  const onClickDropdown = () => {
    setDropdownContent(true)
  }

  const onBlurDropdown = () => {
    setDropdownContent(false)
  }

  const onClickLogout = () => {
    logout().then(user => {
      console.log(user)
      setUser()
    })
  }

  const showDropdownContent = () => {
    if (dropdownContent && currentUser) {
      return (
        <div className="dropdown-content">
          <Link to="">Profile</Link>
          <p onClick={onClickLogout}>Logout</p>
        </div>
      )
    } else if (dropdownContent && !currentUser) {
      return (
        <div className="dropdown-content">
          <Link to="/login">Login</Link>
        </div>
      )
    }
  }

  const showDropdownMenu = () => {
    if (!(path === '/' && !currentUser)) return (
      <div className="dropdown" onClick={onClickDropdown} onBlur={onBlurDropdown}>
        <div className="dropbtn">
          Menu
        </div>
        {showDropdownContent()}
      </div>
    )
  }

  if (toHome) return <Redirect to="/"/>
  if (toLocations) return <Redirect to="/locations"/>

  return (
    <nav className="Header navbar fixed-top">
      <img className={`logo navbar-brand ${move ? 'slide-out-right' : ''}`} alt="logo" src="/images/chizu-logo.svg" onClick={goBack} />
      {showDropdownMenu()}
    </nav>
  )
}

export default Header
