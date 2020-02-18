import React, { useState } from 'react'
import Loading from './Loading'

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

  console.log(getCombinations(locations, limit))

  return (
    <div className="BestPath">
      {loading ? <Loading /> : <div>
        
      </div>}
    </div>
  )
}

export default BestPath
