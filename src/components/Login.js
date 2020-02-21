import React , { useState, useEffect, useContext } from 'react'
import chizuServices from '../services/ChizuServices'
import AuthContext from '../contexts/AuthContext'
import Header from './Header'
import '../styles/Login.css'

const Login = () => {
  const { setUser } = useContext(AuthContext)
  const [data, setData] = useState({ email: "", password: "" })
  const [state, setState] = useState({ error: false, loading: false })
  const { error, loading } = state

  const handleOnChange = (event) => {
    const {name, value} = event.target
    setData({...data, [name]: value})
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setState({ error: false, loading: true })
  }

  useEffect(() => {
    const doLogin = () => chizuServices.login({...data})
      .then(
        (user) => setUser(user),
        () => setState({ error: true, loading: false })
      )

    if (loading && !error) doLogin()
  }, [loading, error, data, setUser])

  const errorClassName = state.error ? 'is-invalid' : ''

  return (
    <div className="Login">
      <Header/>
      <div className="login">
        <h1>CHIZU</h1>
        <form onSubmit={handleSubmit} className="login-form"> 
          <div className="form-group">
            <label>Email</label>
            <input 
              className={`form-control ${errorClassName}`} 
              name="email" 
              type="email" 
              placeholder="Enter email"
              value={data.email} 
              onChange={handleOnChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className={`form-control ${errorClassName}`}  
              name="password" 
              type="password" 
              placeholder="Enter password"
              value={data.password} 
              onChange={handleOnChange}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            disabled={state.loading}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
