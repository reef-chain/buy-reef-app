import { ReefAccount } from '../../util';
import GradientButton from '../GradientButton/GradientButton';
import SelectedAccountBubble from '../SelectedAccount/SelectedAccountBubble';
import './styles.css'

interface Props{
  switchAccount:()=>void;
  shouldDisplayBtn:boolean;
  account:ReefAccount;
}

function Navbar({account,switchAccount,shouldDisplayBtn}:Props) {
  return (
    <div className='navbar'>
        <img src='/reef-logo.svg' className='logo' alt="reef-logo" />
    {shouldDisplayBtn?
    <div className='navbar__select-account'>
      <SelectedAccountBubble ReefAccount={account} />
      <GradientButton title={'Switch Account'} func={switchAccount}/>
    </div>
  :<></>  
  }
        
    </div>
  )
}

export default Navbar