import React from 'react'
import './styles.css'

interface Props{
  setAddress:any;
}

function InputField({setAddress}:Props) {
  return (
    <div>
        <input type="text" className='address-input-field' placeholder='Wallet Address' onChange={(e)=>setAddress(e.target.value)}/>
    </div>
  )
}

export default InputField