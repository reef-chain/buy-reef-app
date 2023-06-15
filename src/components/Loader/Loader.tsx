import React from 'react'
import "./styles.css"

export interface Props{
    text?:string;
}

function Loader({text}:Props) {
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