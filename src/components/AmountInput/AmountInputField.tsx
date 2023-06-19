import React from 'react'
import './styles.css'
import Loader from '../Loader/Loader';
import { reefTokenIconUrl } from '../../utils';

interface Props{
  options:string[];
  selectedFiat?:string | undefined;
  setSelectedFiat?:any;
  setSelectedAmount?:any;
}

function AmountInputField({options,selectedFiat,setSelectedFiat,setSelectedAmount}:Props) {

  const handleFiatChange=(e:React.ChangeEvent<HTMLSelectElement>)=>{
    setSelectedFiat(e.target.value);
  }

  const handleAmountChange=(e:any)=>{
    setSelectedAmount(e.target.value);
  } 

  return (
    <div className='amount-input-field'>
      {options.length == 0?<>
      <Loader text='Fetching Available Pairs'/>
      </>:
      <div>
        {options.length == 1? <div className='amount-input-field--container'>
          <img  className='amount-input-field--fiat-icon' src={reefTokenIconUrl} alt="" />
          <span className='amount-input-field-dropdown'>REEF</span>
          </ div>:
      <div className='amount-input-field--container'>
      <img  className='amount-input-field--fiat-icon' src={`https://s2.coinmarketcap.com/static/cloud/img/fiat-flags/${selectedFiat}.svg`} alt="" />
      <select className="amount-input-field-dropdown" onChange={handleFiatChange} value={selectedFiat}>
      {options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
      </select>
      </div>  
        }
      </div>
      }
      <div>
      </div>
        <input type="number" className = "amount-input-field--input" placeholder='0.0' onChange={handleAmountChange}/>
    </div>
  )
}

export default AmountInputField