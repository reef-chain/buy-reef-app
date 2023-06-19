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

const App = (): JSX.Element => {
  const [pairs, setPairs] = useState<BuyPair[]>([]);
  const [fiatOptions, setFiatOptions] = useState<string[]>([]);

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
      } catch (error) {
        console.error('Error fetching pairs:', error);
      }
    };

    fetchPairs()
  }, []);
  

  return (
    <div>
      <Navbar/>
      <InputField/> 
      <br /> 
      <AmountInputField options={fiatOptions}/>
      <br />
    </div>
  );
};

export default App;
