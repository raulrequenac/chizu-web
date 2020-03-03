import React, { useState } from 'react'
import chizuServices from '../services/ChizuServices'

const Register = () => {
  const { register } = chizuServices
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    image: null 
  })
  const [state, setState] = useState({loading:false, error: false})
  const [success, setSuccess] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

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

    setState({loading: true, error: false})
    register(formData)
    .then(() => {
      setSuccess(true)
    })
    .catch(() => {
      setState({loading: false, error: true})
    })
  }

  const errorClassName = state.error ? 'is-invalid' : ''

  return (
    <div className="Register">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre</label>

          <input
            value={data.name}
            onChange={handleChange}
            autoComplete="off"
            name="name"
            type="text"
            className={`form-control ${errorClassName}`}
            id="name"
            placeholder="Enter name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>

          <input
            value={data.email}
            onChange={handleChange}
            autoComplete="off"
            name="email"
            type="email"
            className={`form-control ${errorClassName}`}
            id="email"
            placeholder="Enter email"
          />
        </div>

        <div className="form-group mb-5">
          <label htmlFor="password">Contraseña</label>

          <input
            value={data.password}
            onChange={handleChange}
            name="password"
            type="password"
            className={`form-control ${errorClassName}`}
            id="password"
            placeholder="Password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Imagen</label>

          <input
            onChange={handleChange}
            name="image"
            type="file"
            className={`form-control ${errorClassName}`}
            id="image"
          />
        </div>

        <button
          type="submit"
          className="btn btn-block btn-primary mb-3"
          disabled={state.loading}
        >
          Registrarse
        </button>
      </form>
    </div>
  )
}

export default Register
