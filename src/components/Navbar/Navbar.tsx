import GradientButton from '../GradientButton/GradientButton';
import './styles.css'

interface Props{
    showDisplayModal:(displayModal:boolean)=>void;
    shouldDisplayBtn:boolean;
}

function Navbar({showDisplayModal,shouldDisplayBtn}:Props) {
  return (
    <div className='navbar'>
        <img src='/reef-logo.svg' className='logo' alt="reef-logo" />
        {
            shouldDisplayBtn && (
        <div className='navbar__select-account'>
        <GradientButton title={"Select Account"} func={()=>showDisplayModal(true)}/>
        </div>
            )
        }
    </div>
  )
}

export default Navbar