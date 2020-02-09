import React, {createContext, useState} from 'react'
import ChizuServices from '../services/ChizuServices'

const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {
    const [data, setData] = useState(JSON.parse(localStorage.getItem('data')))

    const setUser = (user) => {
        localStorage.storage.setItem('user', user ? JSON.stringify(user) : null)
    }

    const logout = () => {
        ChizuServices.logout()
            .then(() => {
                setUser()
            })
    }

    
    const value = {
        currentUser: data,
        setUser,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
    


}

export default AuthContextProvider