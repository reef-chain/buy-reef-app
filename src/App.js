
import { web3Accounts, web3Enable } from '@reef-defi/extension-dapp';
import React, { useEffect, useState } from 'react';
import NoExtension from './NoExtension';
import NoAccount from './NoAccount';
import Buy from './Buy';
import './Style.css';
import "./dropdown.scss"

function App() {

  const appName = "Buy Reef App";
  const [error, setError] = useState({ code: 0, message: 'loading' });

  useEffect(() => {
    initPage();
  }, [])

  const initPage = async () => {
    let extensions = await web3Enable(appName);
    if (extensions.length < 1) {
      setError({
        code: 1,
        message: 'Please install Reef chain or some other Solidity browser extension and refresh the page.'
      });
      return;
    }

    const web3accounts = await web3Accounts();
    if (web3accounts.length < 1) {
      setError({
        code: 2,
        message:
          'App requires at least one account in browser extension. Please create or import account/s and refresh the page.',
      });
      return;
    }

    setError(null);
  }

  return (
    <div>
      {!error && (
        <div className="App d-flex w-100 h-100">
          <div className="w-100 main-content">
            <div className="content">
              <Buy />
            </div>
          </div>
        </div>
      )}
      {error?.code === 1 && <NoExtension />}
      {error?.code === 2 && <NoAccount />}
    </div>
  );
}

export default App;
