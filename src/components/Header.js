import React, { useState, useEffect, useContext } from 'react'
import { Redirect, Link } from 'react-router-dom'
import '../styles/Header.css'
import ChizuServices from '../services/ChizuServices'
import AuthContext from '../contexts/AuthContext'

const Header = ({move}) => {
  const { logout } =  ChizuServices
  const { setUser, currentUser } = useContext(AuthContext)
  const [toHome, setToHome] = useState(false)
  const [toLocations, setToLocations] = useState(false)
  const [dropdownContent, setDropdownContent] = useState(false)
  const [logged, setLogged] = useState(false)
  const path = window.document.location.pathname

  useEffect(() => {
    currentUser ? setLogged(true) : setLogged(false)
  }, [currentUser])

  const onClickDropdown = () => setDropdownContent(true)

  const onBlurDropdown = () => {console.log('hola'); setDropdownContent(false)}

  const onClickLogout = () => logout().then(() => setUser())

  const onClickRedirect = () => path === '/map' ? setToLocations(true) : setToHome(true)

  const showDropdownContent = () => {
    if (dropdownContent && logged) {
      return (
        <div className="dropdown-content">
          <Link to="">
            <img alt="" src="/images/profile.svg" width="30px"/>
          </Link>
          <div onClick={onClickLogout}>
            <img alt="" src="/images/logout.svg" width="30px"/>
          </div>
        </div>
      )
    } else if (dropdownContent && !logged) {
      return (
        <div className="dropdown-content">
          <Link to="/login">
            <img alt="" src="/images/login.svg" width="30px"/>
          </Link>
        </div>
      )
    }
  }

  const showDropdownMenu = () => {
    if (!(path === '/' && !logged)) return (
      <div className="dropdown" onClick={onClickDropdown} onBlur={onBlurDropdown}>
        <div className="dropbtn">
          <img alt="" src="/images/menu.svg" width="30px"/>
        </div>
        {showDropdownContent()}
      </div>
    )
  }

  if (toHome) return <Redirect to="/"/>
  if (toLocations) return <Redirect to="/locations"/>

  return (
    <nav className="Header navbar fixed-top">
      <img 
        className={`logo navbar-brand ${move ? 'slide-out-right' : ''}`} 
        alt="logo" 
        src="/images/chizu-logo.svg" 
        onClick={onClickRedirect} 
      />
      {showDropdownMenu()}
    </nav>
  )
}

export default Header
