import Identicon from "@polkadot/react-identicon";
import './styles.css'
import { toAddressShortDisplay } from "../../utils";
import { ReefAccount } from "../../interfaces";

interface Props{
    name:string;
    address:string;
    shouldDisplayChevron?:boolean;
    setDropdown:any;
    dropdown:boolean;
    setSelectedReefAccount:any;
}

function AccountBox({name,address,shouldDisplayChevron,setDropdown,dropdown,setSelectedReefAccount}:Props) {
  return (
    <div  className={shouldDisplayChevron?'dropdown-account-selection-component':'dropdown-account-selection-component-nc'} key={address} onClick={()=>{
        setSelectedReefAccount({name:name,address:address} as ReefAccount);
        setDropdown(!dropdown)
        }}>
            <div className="dropdown-account-selection">
        <Identicon value={address} size={30}/>
        <div className="dropdown-account-selection-name">{name}</div>
        <div >{toAddressShortDisplay(address)}</div>
            </div>
            <div>
        {shouldDisplayChevron?<div className="dropdown-account-selection-chevron">&lt;</div>:<></>}
            </div>
        
    </div>
  )
}

export default AccountBox