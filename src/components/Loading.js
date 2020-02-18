import React, { useEffect } from 'react'
import '../styles/Loading.css'

const Loading = () => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = "raulanimation.hyperesources/raulanimation_hype_generated_script.js?54278"
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div 
      id="raulanimation_hype_container" 
      className="HYPE_document" 
      style={{
        margin:"auto", 
        position:"relative",
        width:"100%",
        height:"100%",
        overflow:"hidden"
      }}>
	  </div>
  )
}

export default Loading
