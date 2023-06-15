import React from 'react'
import {ReefAccount,toAddressShortDisplay} from '../../util'
import './styles.css'

interface Props{
    ReefAccount:ReefAccount;
}

function SelectedAccountBubble({ReefAccount}:Props) {
  return (
    <div className='selected_account_bubble'>
        <div className='selected_account_bubble__short_addr'>{ReefAccount.address.substring(0,4)}...{ReefAccount.address.substring(43,48)}</div>
        <div className='selected_account_bubble__name'>{ReefAccount.name}</div>
    </div>
  )
}

export default SelectedAccountBubble