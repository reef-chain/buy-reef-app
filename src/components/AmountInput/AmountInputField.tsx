import React from 'react'
import './styles.css'
import Loader from '../Loader/Loader';
import { reefTokenIconUrl , getPairByFiat} from '../../utils';
import { BuyPair } from '../../interfaces';

interface Props{
  options:string[];
  selectedFiat?:string | undefined;
  setSelectedFiat?:any;
  setSelectedAmount?:any;
  setReefAmount?:any
  reefAmount:number;
  amount:number;
  selectedBuyPair:BuyPair|undefined;
  setSelectedBuyPair:any;
  allPairs: any;
  handleBtnLabel:any;
}

function AmountInputField({options,selectedFiat,setSelectedFiat,setReefAmount,setSelectedAmount,amount,reefAmount,selectedBuyPair,setSelectedBuyPair,allPairs,handleBtnLabel}:Props) {

  const handleFiatChange=(e:React.ChangeEvent<HTMLSelectElement>)=>{
    setSelectedFiat(e.target.value);
   let fetchedSelectedBuyPair = getPairByFiat(allPairs as BuyPair[],e.target.value);
    setSelectedBuyPair(fetchedSelectedBuyPair);
    setReefAmount((amount/fetchedSelectedBuyPair.quotation).toFixed(2));
    handleBtnLabel()
  }

  const handleAmountChange=(e:any)=>{
    if(e.target.value<0){
      return;
    }
    let calculated =(e.target.value / selectedBuyPair?.quotation!).toFixed(2);
    setReefAmount(calculated);
    setSelectedAmount(e.target.value);
    handleBtnLabel()
  } 

  const handleReefChange=(e:any)=>{
    if(e.target.value<0){
      return;
    }
    setReefAmount(e.target.value);
    let calculated = (e.target.value * selectedBuyPair?.quotation!).toFixed(2);
    setSelectedAmount(calculated);
    handleBtnLabel()
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
      {options.length == 1?
      <input type="number" className = "amount-input-field--input" placeholder='0.0' onChange={handleReefChange} value={reefAmount}/>:
        <input type="number" className = "amount-input-field--input" placeholder='0.0' onChange={handleAmountChange} value={amount}/>
    }
    </div>
  )
}

export default AmountInputField