import axios from 'axios'

const http=axios.create({
    baseURl: process.env.REACT_APP_API_URL,
    withCredentials: true
})

const login = (({...data}) => http.post('/login',{...data}))
const logout = (()=> http.post('/logout'))
const register = (({...data}) => http.post('/users/register', {...data}))
const profile = (({...data}) => http.patch(`/users/${data.id}`, {...data}))


export default {
    login,
    logout,
    register,
    profile
}
