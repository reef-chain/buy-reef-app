import { Buffer } from 'buffer';
import Loader from './components/Loader/Loader';
import GradientButton from './components/GradientButton/GradientButton';
import Navbar from './components/Navbar/Navbar';
import TextButton from './components/TextButton/TextButton';

interface Status {
  inProgress: boolean;
  message?: string;
}

const App = (): JSX.Element => {

  return (
    <div>
      <Navbar/>
      
    </div>
  );
};

export default App;
