import React from 'react'

interface Props{
    title:string;
    func:any;
}

function TextButton({title,func}:Props) {
  return (
    <button className='text-btn' onClick={()=>func(true)}> {title}</button>
  )
}

export default TextButton