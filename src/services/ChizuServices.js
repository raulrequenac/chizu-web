import axios from 'axios'

const http=axios.create({
    baseURl: process.env.REACT_APP_API_URL,
    withCredentials: true
})

const register = (({...data}) => http.post('/users/register', {...data}))
const validate = (() => http.get('/validate/:validateToken'))
const editUser = (({...data}) => http.patch('/users/edit', {...data}))
const deleteUser = (() => http.post('/users/delete'))
const login = (({...data}) => http.post('/login',{...data}))
const socialLogin = (({...data}) => http.post('/users/socialLogin', {...data}))
const logout = (() => http.post('/logout'))

const addLocation = (({...data}) => http.post('/addLocation', {...data}))
const editLocation = (({...data}) => http.patch('/editLocation/:locationId', {...data}))
const deleteLocation = (() => http.post('/deleteLocation/:locationId'))

const addRoute = (({...data}) => http.post('/addRoute', {...data}))
const editRoute = (({...data}) => http.patch('/editRoute/:routeId', {...data}))
const deleteRoute = (() => http.post('/deleteRoute/:routeId'))

export default {
    register,
    validate,
    editUser,
    deleteUser,
    login,
    socialLogin,
    logout,
    addLocation,
    editLocation,
    deleteLocation,
    addRoute,
    editRoute,
    deleteRoute
}
