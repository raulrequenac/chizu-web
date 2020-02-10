import React, { useState } from 'react'
import Header from './Header'
import { Link } from 'react-router-dom'
import DelayLink from 'react-delay-link';
import '../styles/Home.css'

const Home = () => {
  const [move, setMove] = useState(false)

  const handlerOnClick = (event) => {
    setMove({move: true})
  }

  return (
    <div className="Home">
      <Header move={move}/>
      <div className="content">
        <h1>CHIZU</h1>
        <h2>Elige tu camino.</h2>
        <p>Con Chizu podrás encontrar las mejores rutas para tus viajes.</p>
        <DelayLink delay={900} to="/map" clickAction={handlerOnClick} replace={false}>
          <button type="button" className="start-button btn btn-block">Comenzar</button>
        </DelayLink>
        <p className="login">¿Ya usas Chizu? <Link to="/login"><b>Conectarse</b></Link></p>
      </div>
    </div>
  )
}

export default Home
