import Identicon from "@polkadot/react-identicon";
import './styles.css'
import { toAddressShortDisplay } from "../../utils";

interface Props{
    name:string;
    address:string;
}

function AccountBox({name,address}:Props) {
  return (
    <div className="dropdown-account-selection">
        <Identicon value={address} size={30}/>
        <div className="dropdown-account-selection-name">{name}</div>
        <div >{toAddressShortDisplay(address)}</div>
    </div>
  )
}

export default AccountBox