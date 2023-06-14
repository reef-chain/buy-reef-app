import React from 'react'
import "./styles.css"


function Loader({text}) {
  return (
    <div className='loader'>
    <div className="dot-spinner">
  <div className="dot"></div>
  <div className="dot"></div>
  <div className="dot"></div>
  <div className="dot"></div>
  <div className="dot"></div>
    </div>
    {text}
    </div>

  )
}

export default Loader