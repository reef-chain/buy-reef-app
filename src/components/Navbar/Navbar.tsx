import { ReefAccount } from '../../util';
import GradientButton from '../GradientButton/GradientButton';
import SelectedAccountBubble from '../SelectedAccount/SelectedAccountBubble';
import './styles.css'


function Navbar() {
  return (
    <div className='navbar'>
        <img src='/reef-logo.svg' className='logo' alt="reef-logo" />    
    </div>
  )
}

export default Navbar