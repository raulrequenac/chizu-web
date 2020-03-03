import React, { useState, useEffect, useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import chizuServices from '../services/ChizuServices'
import AuthContext from '../contexts/AuthContext'
import queryString from 'query-string'
import '../styles/Login.css'

const Login = () => {
  const { login, socialLogin } = chizuServices
  const { setUser } = useContext(AuthContext)
  const [data, setData] = useState({ email: "", password: "" })
  const [state, setState] = useState({ error: false, loading: false })
  const { error, loading } = state
  const [toHome, setToHome] = useState(false)
  const [logged, setLogged] = useState(false)
  const parse = queryString.parse(window.location.search)
  const [userValidated, setUserValidated] = useState(false)

  useEffect(() => {
    if (parse.validated) setUserValidated(true)
    const interval = setTimeout(() => setUserValidated(false), 3000)
    
    return () => clearTimeout(interval)
  }, [parse.validated])

  const handleOnChange = (event) => {
    const {name, value} = event.target
    setData({...data, [name]: value})
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setState({ error: false, loading: true })
  }

  const onClickSocialLogin = () => {
    socialLogin({})
      .then(user => console.log(user))
      .catch(e => console.log(e))
  }

  const onClickHome = () => {
    setToHome(true)
  }

  useEffect(() => {
    if (loading && !error) login({...data})
      .then(
        (user) => {
          setUser(user)
          setLogged(true)
        },
        () => setState({ error: true, loading: false })
      )
  }, [loading, error, data, setUser, login])

  const showValidated = () => {
    if (userValidated) return (
      <div className="validated">
        User has been validated!
      </div>
    )
  }

  const errorClassName = state.error ? 'is-invalid' : ''
  if (toHome) return <Redirect to="/"/>
  if (logged) return <Redirect to="/profile"/>

  return (
    <div className="Login">
      {showValidated()}
      <div className="login-title" onClick={onClickHome}>
        <img alt="" src="/images/lock.svg" width="125px"/>
        <h1>CHIZU</h1>
      </div>
      <form onSubmit={handleSubmit} className="login-form"> 
        <div className="form-group login-group">
        <img alt="" src="/images/mail.svg" className="login-label"/>
          <input 
            className={`form-control login-input ${errorClassName}`} 
            name="email" 
            type="email" 
            placeholder="Email"
            value={data.email} 
            onChange={handleOnChange}
          />
        </div>

        <div className="form-group login-group">
          <img alt="" src="/images/key.svg" className="login-label"/>
          <input
            className={`form-control login-input ${errorClassName}`}  
            name="password" 
            type="password" 
            placeholder="Contraseña"
            value={data.password} 
            onChange={handleOnChange}
          />
        </div>
        <button 
          type="submit" 
          className="login-button" 
          disabled={state.loading}
        >
          Login
        </button>
      </form>
      <button className="loginBtn loginBtn--google" onClick={onClickSocialLogin}>
        Conectarse con Google
      </button>
      <div className="register">
        <p>¿Todavía no tienes una cuenta?</p>
        <Link to="/register">Registrarse</Link>
      </div>
    </div>
  )
}

export default Login
