import React, { useState, useContext, useEffect } from 'react'
import Loading from './Loading'
import { Redirect } from 'react-router-dom'
import mapboxServices from '../services/MapboxServices'
import LocationsContext from '../contexts/LocationsContext'

const BestPath = () => {
  const { info, locations } = useContext(LocationsContext)
  const locs = locations.filter(loc => loc)
  const { limit, start } = info
  const [bestPath, setBestPath] = useState(null)


  useEffect(() => {
    const getCombinations = (locs, limit, results = [], result = []) => {
      for(let i=0; i<locs.length; ++i) {
        let newResult = result.slice();
        let newArr = locs.slice();
    
        newResult.push(locs[i]);
        newArr.splice(i, 1);
    
        if(limit>1) {
          getCombinations(newArr, limit-1, results, newResult);
        } else {
          results.push(newResult)
        }
      }
    
      return results
    }

    const smallestIndex = (a) => {
      let lowest = 0;
      for (let i = 1; i < a.length; i++) {
        if (a[i] < a[lowest]) lowest = i;
      }
      return lowest;
    }
  
    if (locs) {
      const coordinates = locs.map(loc => loc.coordinates.join(',')).join(';')
      mapboxServices.matrix(coordinates)
        .then(distances => {
          const directions = [...getCombinations(locs.map((loc, i) => ({loc, i})), limit)]
          const routeDistances = directions.map((direction, i) => 
            direction.reduce((acc, loc, i, dir) => {
              return dir[i+1] ? acc + distances.data.durations[loc.i][dir[i+1].i] : acc
            }, 0)
          )

          console.log(directions[smallestIndex(routeDistances)])
          setBestPath(directions[smallestIndex(routeDistances)]
            .map(locs => locs.loc.coordinates.join(',')).join(';')
          )
        })
    }
  }, [limit, locs])
  
  return (
    <div className="BestPath">
      {locs ? (bestPath ? <Redirect to={`/map?bestPath=${bestPath}`}/> : <Loading />) : <Redirect to='/locations'/>}
    </div>
  )
}

export default BestPath
