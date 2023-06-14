import Identicon from '@polkadot/react-identicon';
import { ReefAccount, toAddressShortDisplay } from '../../util';
import './styles.css'
import GradientButton from '../GradientButton/GradientButton';
import TextButton from '../TextButton/TextButton';

interface Account {
  account: ReefAccount
  onClick?: () => void;
  isAccountSelected?:boolean;
  isDestAccount?:boolean;
  showChangeAccountBtn?:boolean;
  changeAccountFunc?:(changeAccount:boolean)=>void;
}

const Account = ({ account, onClick ,isAccountSelected,isDestAccount,showChangeAccountBtn,changeAccountFunc}: Account): JSX.Element => (
  <div onClick={onClick} className={`accountBox`}>
    <div className='accountBox__identicon'>
      <Identicon value={account.address} size={64} theme="substrate" />
    </div>
    <div className='accountBox__details'>
      <div className='accountBox__details_name' >{ account.name }</div>
      <div className='accountBox__details_shortaddress'>
        <span>Native Address : </span>{ toAddressShortDisplay(account.address) }</div>
        {isDestAccount == true?
        <div></div>:
      <div className='accountBox__details_shortaddress'>
        <span>EVM Address : </span>{ toAddressShortDisplay(account.evmAddress) }</div>
        
      }
    </div>
    {isDestAccount==true?
    <div>
    </div>  : showChangeAccountBtn!=true?
    <div>
      {isAccountSelected == false? (
        <div className='accountBox__end'>
          <GradientButton title={"Select"} />
        </div>
      ):
      <div className='accountBox__end'>
      {/* <div className='accountBox__selected'>
        Selected
      </div> */}
        <GradientButton title={"Selected"} isEnabled={false}/>
      </div>
      }
    </div>:<>
    <TextButton title={"Change Account"} func={changeAccountFunc}/>
    </>
  }
  </div>
);

export default Account;
