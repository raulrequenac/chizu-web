import React, { useState, useEffect } from 'react'
import chizuServices from '../services/ChizuServices'
import { Redirect } from 'react-router-dom'
import Loading from './Loading'

const Validate = () =>{
  const [status, setStatus] = useState({ loading: true, error: false })
  const { validate } = chizuServices
  const token = window.document.location.pathname.split('/')[2]

  useEffect(() => {
    validate(token)
      .then(() => setStatus({ loading: false, error: false }))
      .catch(() => setStatus({ loading: false, error: true }))
  }, [validate, token])

  if (status.error) return <Redirect to='/'/>

  return status.loading ? <Loading /> : <Redirect to="/login?validated=true"/>
}

export default Validate