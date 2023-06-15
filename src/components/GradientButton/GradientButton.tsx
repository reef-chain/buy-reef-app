import React from 'react'
import './styles.css'

export interface Props{
    func?:any;
    title:String;
    isEnabled?:false;
}

function GradientButton({func,title,isEnabled}:Props) {
  return (
    <button className={`${(isEnabled==false)?'gradient-button-disabled':'gradient-button'} `} onClick={func}>{title}</button>
  )
}

export default GradientButton