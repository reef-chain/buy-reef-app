import React from 'react'
import './styles.css'


function GradientButton({func,title,isEnabled}) {
  return (
    <button className={`${(isEnabled==false)?'gradient-button-disabled':'gradient-button'} `} onClick={func}>{title}</button>
  )
}

export default GradientButton