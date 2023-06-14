import GradientButton from '../GradientButton/GradientButton';
import './styles.css'
import React from 'react';

function Navbar({showDisplayModal,shouldDisplayBtn}) {
  return (
    <div className='navbar'>
        <img src='/reef-logo.svg' className='logo' alt="reef-logo" />
        {
            shouldDisplayBtn && (
        <div className='navbar__select-account'>
        <GradientButton title={"Select Account"} func={()=>{showDisplayModal(true);
        console.log('done')}}/>
        </div>
            )
        }
    </div>
  )
}

export default Navbar