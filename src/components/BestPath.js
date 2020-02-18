import React, { useState } from 'react'
import Loading from './Loading'
import { Redirect } from 'react-router-dom'
import mapboxServices from '../services/MapboxServices'

const BestPath = ({ info }) => {
  const { locations, limit, start } = info
  const [loading, setLoading] = useState(true)

  const getCombinations = (locations, limit, results = [], result = []) => {
    for(let i=0; i<locations.length; ++i) {
      let newResult = result.slice();
      let newArr = locations.slice();
  
      newResult.push(locations[i]);
      newArr.splice(i, 1);
  
      if(limit>1) {
        getCombinations(newArr, limit-1, results, newResult);
      } else if (results.length){
        newResult.reverse()
        let repeated = results.some(el => {
          for(let j=0; j<el.length; j++) {
            if (el[j] !== newResult[j]) return false
          }
          return true
        })
        if (!repeated) {
          results.push(newResult.reverse())
        }
      } else {
        results.push(newResult)
      }
    }
  
    return results
  }
  
  if (locations) {
    let directions = [...getCombinations(locations, limit)]
    let coordinates = directions.map(direction => direction.map(loc => loc.coordinates.join(',')).join(';'))
    let coordinatesPromise = coordinates.map(coords => mapboxServices.directions(coords)
      .then(route => coords = route))

    Promise.all(coordinatesPromise)
      .then(coordinates => {
        let distances = coordinates.map(coord => coord.data.routes[0].distance)
        
        console.log(...coordinates.filter(coord => coord.data.routes[0].distance === Math.min(...distances)))
      })
  }

  return (
    <div className="BestPath">
      {locations ? (loading ? <Loading /> : <Redirect to='/map'/>) : <Redirect to='/locations'/>}
    </div>
  )
}

export default BestPath
