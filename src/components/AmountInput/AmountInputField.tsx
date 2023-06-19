import React from 'react'
import './styles.css'

interface Props{
  options:string[];
}

function AmountInputField({options}:Props) {
  return (
    <div className='amount-input-field'>
      <div>
      <select className="amount-input-field-dropdown">
      {options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
      </select>
      </div>
        <input type="number" className = "amount-input-field--input" placeholder='0.0'/>
    </div>
  )
}

export default AmountInputField