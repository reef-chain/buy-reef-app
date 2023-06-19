import React from 'react'
import './styles.css'
import Loader from '../Loader/Loader';

interface Props{
  options:string[];
}

function AmountInputField({options}:Props) {
  return (
    <div className='amount-input-field'>
      {options.length == 0?<>
      <Loader text='Fetching Available Pairs'/>
      </>:
      <div className='amount-input-field--container'>
      <img  className='amount-input-field--fiat-icon' src={`https://s2.coinmarketcap.com/static/cloud/img/fiat-flags/EUR.svg`} alt="" />
      <select className="amount-input-field-dropdown">
      {options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
      </select>
      </div>
      }
      <div>
      </div>
        <input type="number" className = "amount-input-field--input" placeholder='0.0'/>
    </div>
  )
}

export default AmountInputField