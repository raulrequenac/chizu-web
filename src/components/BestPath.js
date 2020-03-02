import React, { useState, useContext, useEffect } from 'react'
import Loading from './Loading'
import { Redirect } from 'react-router-dom'
import mapboxServices from '../services/MapboxServices'
import LocationsContext from '../contexts/LocationsContext'

const BestPath = () => {
  const { info, locations } = useContext(LocationsContext)
  const { limit, start } = info
  const [bestPath, setBestPath] = useState(null)
  const [error, setError] = useState(false)

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
  
    if (locations) {
      const coordinates = locations.map(loc => loc.coordinates.join(',')).join(';')
      mapboxServices.matrix(coordinates)
        .then(distances => {
          const directions = [...getCombinations(locations.map((loc, i) => ({loc, i})), limit)]
          const routeDistances = directions.map((direction, i) => 
            direction.reduce((acc, loc, i, dir) => {
              return dir[i+1] ? acc + distances.data.durations[loc.i][dir[i+1].i] : acc
            }, 0)
          )

          setBestPath(directions[smallestIndex(routeDistances)]
            .map(locs => locs.loc.coordinates.join(',')).join(';')
          )
        })
        .catch(_ => setError(true))
    }
  }, [limit, locations])

  if (error) return <Redirect to={`/locations?error=${error}`}/>
  
  return (
    <div className="BestPath">
      {bestPath ? <Redirect to={`/map?bestPath=${bestPath}`}/> : <Loading />}
    </div>
  )
}

export default BestPath
