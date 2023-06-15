import GradientButton from '../GradientButton/GradientButton';
import './styles.css'

interface Props{
  switchAccount:()=>void;
  shouldDisplayBtn:boolean;
}

function Navbar({switchAccount,shouldDisplayBtn}:Props) {
  return (
    <div className='navbar'>
        <img src='/reef-logo.svg' className='logo' alt="reef-logo" />
    {shouldDisplayBtn?
    <div className='navbar__select-account'>
      <GradientButton title={'Switch Account'} func={switchAccount}/>
    </div>
  :<></>  
  }
        
    </div>
  )
}

export default Navbar