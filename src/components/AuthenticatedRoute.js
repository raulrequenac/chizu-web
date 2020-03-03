import React, { useContext } from 'react'
import AuthContext from '../contexts/AuthContext'
import { Redirect, Route } from 'react-router-dom'

const AuthenticatedRoute = ({ component, ...rest }) => {
  const { currentUser } = useContext(AuthContext)

  return currentUser ? <Redirect to="/"/> : <Route {...rest} component={component} />
}

export default AuthenticatedRoute
