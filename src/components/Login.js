import React , { useState } from 'react'
import ChizuServices from '../services/ChizuServices'

const Login = () => {
    const [data, setData] = useState({email:"",password:""})

    const handleChanged = (event) => {
        const {name, value} = event.target
        setData({...data, [name]: value})
        
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        ChizuServices.login({...data})
            .then(
                user => {
                    
                })
    }

    return(
        <div>
            <form onSubmit={handleSubmit}> 
                <div className="form-group mb-4">
                    <label>Email</label>
                    <input name="email" type="email" value={data.email} onChange={handleChanged}/>
                </div>

                <div className="form-group mb-4">
                    <label>Password</label>
                    <input name="password" type="password" value={data.password} onChange={handleChanged}/>
                </div>
                <button type="submit" className="btn btn-block btn-primary md-3">Login</button>
            </form>
        </div>
    )


}
export default Login
