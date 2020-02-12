import React, { useContext } from 'react'
import AuthContext from '../../contexts/AuthContext'
import { Redirect, Route } from 'react-router-dom'

const AuthenticatedRoute = () => {
  const { currentUser } = useContext(AuthContext)
  if (!currentUser) {
    return <Redirect to="/login"/>
  } else {
    return <Route />
  }
}

export default AuthenticatedRoute
