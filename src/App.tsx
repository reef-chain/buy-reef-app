import { Buffer } from 'buffer';
import Loader from './components/Loader/Loader';
import GradientButton from './components/GradientButton/GradientButton';
import Navbar from './components/Navbar/Navbar';
import TextButton from './components/TextButton/TextButton';
import InputField from './components/InputField/InputField';
import AmountInputField from './components/AmountInput/AmountInputField';

const App = (): JSX.Element => {

  return (
    <div>
      <Navbar/>
      <InputField/> 
      <br /> 
      <AmountInputField options={['option 1','option 2','option 3','option 4']}/>
    </div>
  );
};

export default App;
