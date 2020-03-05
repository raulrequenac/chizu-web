import React, { useState } from 'react'
import chizuServices from '../services/ChizuServices'
import { Redirect } from 'react-router-dom'
import '../styles/Register.css'

const Register = () => {
  const { register } = chizuServices
  const [toHome, setToHome] = useState(false)
  const [state, setState] = useState({ loading:false, error: false })
  const [success, setSuccess] = useState(false)
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    image: null 
  })

  const onClickHome = () => setToHome(true)

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setData({
      ...data,
      [name]: files ? files[0] : value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('image', data.image)

    setState({ loading: true, error: false })
    register(formData)
      .then(() => setSuccess(true))
      .catch(() => setState({ loading: false, error: true }))
  }

  const errorClassName = state.error ? 'is-invalid' : ''

  if (toHome) return <Redirect to="/"/>
  if (success) return <Redirect to="/login?registered=true"/>

  return (
    <div className="Register">
      <div className="register-title" onClick={onClickHome}>
        <img alt="" src="/images/register.svg" width="125px"/>
        <h1>CHIZU</h1>
      </div>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group register-group">
          <img alt="" src="/images/name.svg" width="30px" className="register-label"/>
          <input
            className={`form-control register-input ${errorClassName}`} 
            value={data.name}
            onChange={handleChange}
            autoComplete="off"
            name="name"
            type="text"
            id="name"
            placeholder="Nombre"
          />
        </div>

        <div className="form-group register-group">
          <img alt="" src="/images/mail.svg" width="30px" className="register-label"/>
          <input
            className={`form-control register-input ${errorClassName}`} 
            value={data.email}
            onChange={handleChange}
            autoComplete="off"
            name="email"
            type="email"
            id="email"
            placeholder="Email"
          />
        </div>

        <div className="form-group register-group">
          <img alt="" src="/images/key.svg" width="30px" className="register-label"/>
          <input
            className={`form-control register-input ${errorClassName}`} 
            value={data.password}
            onChange={handleChange}
            name="password"
            type="password"
            id="password"
            placeholder="Contraseña"
          />
        </div>

        <div className="form-group register-group">
          <img alt="" src="/images/image.svg" width="30px" className="register-label"/>
          <label className={'form-control register-input'}>
            Eliga una imagen
            <img alt="" src="/images/search.svg" width="25px" className="register-image-search"/>
            <input
              onChange={handleChange}
              name="image"
              type="file"
              id="image"
            />
          </label>
          
        </div>

        {errorClassName ? <small className="error">Algo ha ocurrido mal.</small> : <></>}

        <button
          type="submit"
          className="register-button"
          disabled={state.loading}
        >
          Registrarse
        </button>
      </form>
    </div>
  )
}

export default Register
