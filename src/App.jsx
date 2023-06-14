import './App.css'
import Navbar from './components/Navbar/Navbar'
import { useState } from 'react'

function App() {
  const [modalDisplay,setModalDisplay] = useState(false);
  return (
    <>
    <Navbar showDisplayModal={setModalDisplay} shouldDisplayBtn={true}/>
    </>
  )
}

export default App
