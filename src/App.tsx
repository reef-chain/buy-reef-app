import GradientButton from './components/GradientButton/GradientButton';
import Navbar from './components/Navbar/Navbar';
import AmountInputField from './components/AmountInput/AmountInputField';
import * as utils from './utils';
import { useEffect,useState } from 'react';
import { BuyPair, BuyPayload, ReefAccount } from './interfaces';
import Header from './components/Header/Header';
import { web3Accounts, web3Enable, web3FromSource } from '@reef-defi/extension-dapp';
import AccountBox from './components/AccountBox/AccountBox';

const App = (): JSX.Element => {
  const [pairs, setPairs] = useState<BuyPair[]>([]);
  const [fiatOptions, setFiatOptions] = useState<string[]>([]);
  const [selectedFiat,setSelectedFiat] = useState<string>();
  const [selectedAmount,setSelectedAmount] = useState<number>(0.0);
  const [selectedReefAmount,setSelectedReefAmount] = useState<number>(0.0);
  const [selectedBuyPair,setSelectedBuyPair] = useState<BuyPair>();
  const [loading,setLoading] = useState<boolean>(false);
  const [accounts,setAccounts] = useState<any>([]);
  const [dropdown,setDropdown] = useState<boolean>(false);
  const [selectedReefAccount,setSelectedReefAccount] = useState<ReefAccount>();

  useEffect(()=>{
    getAccounts()
  },[])

  useEffect(() => {
    const fetchPairs = async () => {
      try {
        const fetchedPairs = await utils.fetchPairs();
        setPairs(fetchedPairs);
        let fetchedFiatOptions = []
        for (let i = 0; i < fetchedPairs.length; i++) {
          fetchedFiatOptions.push(fetchedPairs[i].fiatCurrency);
        }
        setFiatOptions(fetchedFiatOptions);
        setSelectedFiat('EUR')
        const fetchedBuyPair = utils.getPairByFiat(fetchedPairs,'EUR');
        setSelectedBuyPair(fetchedBuyPair);
      } catch (error) {
        console.error('Error fetching pairs:', error);
      }

    };

    fetchPairs()
  }, []);

  const getAccounts = async()=>{
    try {
      let extension = await utils.getReefExtension("Buy Reef App")
      if (!extension) {
        console.log('extension not installed! trying again ... ');
        extension = await utils.getReefExtension('Reef EVM connection');
      }
        const allAccounts = await web3Accounts();
        const reefAccounts = []
        for(let i=0;i<allAccounts.length;i++){
          reefAccounts.push(utils.accountToReefAccount(allAccounts[i]))
        }
        setAccounts(reefAccounts);
        setSelectedReefAccount(reefAccounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const getBtnLabel = ()=>{
    if(accounts.length===0){
      return "Install REEF Extension"
    }
    if(selectedAmount<selectedBuyPair?.minLimit!){
      return 'Amount too low. Minimum amount is '+selectedBuyPair?.minLimit!;
    }else if(selectedAmount>selectedBuyPair?.maxLimit!){
      return 'Amount too high. Maximum amount is '+selectedBuyPair?.minLimit!;
    }else if(pairs.length == 0){
      return 'Loading ...';
    }else if(selectedReefAccount?.address?.length == 0 || !selectedReefAccount?.address){
      return 'Please enter address';
    }else if(selectedReefAccount.address.length!=48){
      return 'Invalid address'
    }else if(loading == true){
      return 'Transaction in progress ...'
    }
    return 'Buy Reef'
  }

  const buy = async()=>{
    if(getBtnLabel()!="Buy Reef")return;
    setLoading(true);
    const tradePayload = {
      address: selectedReefAccount?.address,
      fiatCurrency: selectedFiat,
      cryptoCurrency: 'REEF',
      orderAmount: selectedAmount,
      merchantRedirectUrl: 'https://app.reef.io/',
    } as BuyPayload

    const {message}= await utils.getAddressNonceMessage(selectedReefAccount?.address!);
    await web3Enable('Reef Wallet App');
    const [account] = await web3Accounts();
    const injector = await web3FromSource(account.meta.source);
    const signRaw = await injector?.signer?.signRaw;
    if (signRaw != null) {
      const { signature } = await signRaw({
        address: selectedReefAccount!.address,
        data: message,
        type: 'bytes',
      });
      const {authenticated,token}=await utils.generateJWT(selectedReefAccount!.address,signature);
      if(authenticated){
        const trade = await utils.createTrade(tradePayload,token);
    console.log(trade)
      const redirectUrl = trade.data.eternalRedirectUrl;
      if(redirectUrl){
        window.open(redirectUrl, '_blank');
      }
    setLoading(false);
      getBtnLabel()
      setSelectedAmount(0.0);
      setSelectedReefAmount(0.0);
      }
    }
  }

  return (
    <div>
      <Navbar/>
      <div className='center-container'>
      <div className='buy-reef-dashboard'>
      
       <Header />
       {accounts.length == 0?<>
       </>:
       <div className='selected-wallet-address-dropdown'>
       {dropdown?
       <div className='selected-wallet-address-dropdown-list'>
       {accounts.map((account:any)=>{
        return(
          <AccountBox name={account.name} address={account.address} setDropdown={setDropdown} dropdown={dropdown} setSelectedReefAccount={setSelectedReefAccount}/>
        )
       })}
       </div>:
       <AccountBox name={selectedReefAccount!.name} address={selectedReefAccount!.address} shouldDisplayChevron={true} setDropdown={setDropdown} dropdown={dropdown} setSelectedReefAccount={setSelectedReefAccount}/>
      }
       </div>}
       
      <AmountInputField selectedFiat={selectedFiat} options={fiatOptions} setSelectedAmount={setSelectedAmount} setSelectedBuyPair={setSelectedBuyPair} setSelectedFiat={setSelectedFiat} reefAmount={selectedReefAmount}  setReefAmount={setSelectedReefAmount} amount={selectedAmount} selectedBuyPair = {selectedBuyPair} allPairs={pairs} handleBtnLabel={getBtnLabel} />

      <AmountInputField options={['REEF']} setSelectedAmount={setSelectedAmount} setSelectedBuyPair={setSelectedBuyPair}  setSelectedFiat={setSelectedFiat} reefAmount={selectedReefAmount}  setReefAmount={setSelectedReefAmount} amount={selectedAmount} selectedBuyPair = {selectedBuyPair} allPairs={pairs} handleBtnLabel={getBtnLabel}/>

      <GradientButton title={getBtnLabel()} isEnabled={getBtnLabel()=='Buy Reef'} func={buy}/>
      </div>
      </div>
    </div>
  );
};

export default App;
