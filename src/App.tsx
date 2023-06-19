import { Buffer } from 'buffer';
import Loader from './components/Loader/Loader';
import GradientButton from './components/GradientButton/GradientButton';
import Navbar from './components/Navbar/Navbar';
import TextButton from './components/TextButton/TextButton';
import InputField from './components/InputField/InputField';
import AmountInputField from './components/AmountInput/AmountInputField';
import * as utils from './utils';
import { useEffect,useState } from 'react';
import { BuyPair } from './interfaces';
import Header from './components/Header/Header';

const App = (): JSX.Element => {
  const [pairs, setPairs] = useState<BuyPair[]>([]);
  const [fiatOptions, setFiatOptions] = useState<string[]>([]);
  const [selectedFiat,setSelectedFiat] = useState<string>();
  const [selectedAmount,setSelectedAmount] = useState<number>(0.0);
  const [selectedReefAmount,setSelectedReefAmount] = useState<number>(0.0);

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
      } catch (error) {
        console.error('Error fetching pairs:', error);
      }
    };

    fetchPairs()
  }, []);
  

  return (
    <div>
      <Navbar/>
      <div className='center-container'>
      <div className='buy-reef-dashboard'>
        <Header />
      <InputField/> 

      <AmountInputField selectedFiat={selectedFiat} options={fiatOptions} setSelectedFiat = {setSelectedFiat} setSelectedAmount={setSelectedAmount} amount = {selectedAmount} />

      <AmountInputField options={['REEF']} setSelectedAmount={setSelectedReefAmount} amount={selectedReefAmount} />

      <GradientButton title={'an'} />
      </div>
      </div>
    </div>
  );
};

export default App;
