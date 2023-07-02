import React from 'react'
import './styles.css'

interface Props{
  setAddress:any;
}

function InputField({setAddress}:Props) {
  return (
    <div style={{display:'flex'}}>
        <input type="text" className='address-input-field' placeholder='Wallet Address' style={{flex:1}} onChange={(e)=>setAddress(e.target.value)}/>
    </div>
  )
}

export default InputField