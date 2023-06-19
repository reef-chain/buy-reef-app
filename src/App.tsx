import { Buffer } from 'buffer';
import Loader from './components/Loader/Loader';
import GradientButton from './components/GradientButton/GradientButton';
import Navbar from './components/Navbar/Navbar';
import TextButton from './components/TextButton/TextButton';
import InputField from './components/InputField/InputField';

const App = (): JSX.Element => {

  return (
    <div>
      <Navbar/>
      <InputField/>  
    </div>
  );
};

export default App;
