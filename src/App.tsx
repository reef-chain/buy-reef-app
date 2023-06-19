import { Buffer } from 'buffer';
import Loader from './components/Loader/Loader';
import GradientButton from './components/GradientButton/GradientButton';
import Navbar from './components/Navbar/Navbar';
import TextButton from './components/TextButton/TextButton';
import InputField from './components/InputField/InputField';
import AmountInputField from './components/AmountInput/AmountInputField';
import * as utils from './utils';
import { useEffect,useState } from 'react';
import { BuyPair, BuyPayload } from './interfaces';
import Header from './components/Header/Header';

const App = (): JSX.Element => {
  const [pairs, setPairs] = useState<BuyPair[]>([]);
  const [fiatOptions, setFiatOptions] = useState<string[]>([]);
  const [selectedFiat,setSelectedFiat] = useState<string>();
  const [selectedAmount,setSelectedAmount] = useState<number>(0.0);
  const [selectedReefAmount,setSelectedReefAmount] = useState<number>(0.0);
  const [selectedBuyPair,setSelectedBuyPair] = useState<BuyPair>();
  const [address,setAddress] = useState<string>();
  const [loading,setLoading] = useState<boolean>(false);

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

  const getBtnLabel = ()=>{
    if(selectedAmount<selectedBuyPair?.minLimit!){
      return 'Amount too low. Minimum amount is '+selectedBuyPair?.minLimit!;
    }else if(selectedAmount>selectedBuyPair?.maxLimit!){
      return 'Amount too high. Maximum amount is '+selectedBuyPair?.minLimit!;
    }else if(pairs.length == 0){
      return 'Loading ...';
    }else if(address?.length == 0 || !address){
      return 'Please enter address';
    }else if(address.length!=48){
      return 'Invalid address'
    }else if(loading == true){
      return 'Transaction in progress ...'
    }
    return 'Buy Reef'
  }

  const buy = async()=>{
    setLoading(true);
    const tradePayload = {
      address: address,
      fiatCurrency: selectedFiat,
      cryptoCurrency: 'REEF',
      orderAmount: selectedAmount,
      merchantRedirectUrl: 'https://app.reef.io/',
    } as BuyPayload

    const trade = await utils.createTrade(tradePayload);

    try {
      const redirectUrl = trade.data.eternalRedirectUrl;
      if(redirectUrl){
        window.open(redirectUrl, '_blank');
      }
    setLoading(false);
    } catch (error) {
      console.log(error)
    }
    setLoading(false);
      getBtnLabel()
      setAddress('');
      setSelectedAmount(0.0);
      setSelectedReefAmount(0.0);
  }

  return (
    <div>
      <Navbar/>
      <div className='center-container'>
      <div className='buy-reef-dashboard'>
      
       <Header />

      <InputField setAddress={setAddress} /> 
      <AmountInputField selectedFiat={selectedFiat} options={fiatOptions} setSelectedAmount={setSelectedAmount} setSelectedBuyPair={setSelectedBuyPair} setSelectedFiat={setSelectedFiat} reefAmount={selectedReefAmount}  setReefAmount={setSelectedReefAmount} amount={selectedAmount} selectedBuyPair = {selectedBuyPair} allPairs={pairs} handleBtnLabel={getBtnLabel} />

      <AmountInputField options={['REEF']} setSelectedAmount={setSelectedAmount} setSelectedBuyPair={setSelectedBuyPair}  setSelectedFiat={setSelectedFiat} reefAmount={selectedReefAmount}  setReefAmount={setSelectedReefAmount} amount={selectedAmount} selectedBuyPair = {selectedBuyPair} allPairs={pairs} handleBtnLabel={getBtnLabel}/>

      <GradientButton title={getBtnLabel()} isEnabled={getBtnLabel()=='Buy Reef'} func={buy}/>
      </div>
      </div>
    </div>
  );
};

export default App;
