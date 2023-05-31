import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './App.css'
import { web3FromSource, web3Enable, web3Accounts } from '@reef-defi/extension-dapp';
import Dropdown from 'react-bootstrap/Dropdown'
import Image from 'react-bootstrap/Image'
import { Spinner } from 'react-bootstrap';
import { AiOutlineUser } from "react-icons/ai";

function App() {
  const FROM_FIAT_SYMBOL = 'EUR';
  const TOKEN_NAME = 'REEF';
  const iconUrl = {
    REEF: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6951.png',
  };

  const [tokenAmount, setTokenAmount] = useState('');
  const [allPairs, setAllPairs] = useState([]);
  const [fiatAmount, setFiatAmount] = useState('');
  const [selectedPair, setSelectedPair] = useState();
  const [selectedFiatCurrency, setSelectedFiatCurrency] = useState('EUR');
  const [disableBuy, setDisableBuy] = useState(true);
  const [disableInputs, setDisableInputs] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');

  const binanceConnectApiUrl = 'https://onramp.reefscan.info';

  const binanceConnectApi = axios.create({ baseURL: binanceConnectApiUrl });

  function get(url) {
    return binanceConnectApi.get(url)
      .then((response) => response.data);
  }

  function post(url, payload, config) {
    return binanceConnectApi.post(url, payload, config)
      .then((response) => response.data);
  }

  useEffect(() => {
    get('/get-pairs')
      .then((pairs) => {
        setAllPairs(pairs);
        const pair = pairs.filter((item) => item.fiatCurrency === FROM_FIAT_SYMBOL && item.cryptoCurrency === TOKEN_NAME);
        if (pair.length === 0) {
          throw new Error();
        }
        setSelectedPair(pair[0]);
      })
      .catch(() => {
        setError('Can not retrieve trading pair information');
        setDisableInputs(true);
      });
  }, []);

  useEffect(() => {
    const isLastCharDigit = (num) => /\d/.test(num.slice(-1));
    const isValidPositiveNumber = (num) => num?.length > 0 && num != null && !Number.isNaN(+num) && +num > 0;

    const tokenAmountValid = isValidPositiveNumber(tokenAmount) && isLastCharDigit(tokenAmount);
    const fiatAmountValid = isValidPositiveNumber(fiatAmount) && isLastCharDigit(fiatAmount);
    const someInputIsInvalid = !tokenAmountValid || !fiatAmountValid || !address;
    setDisableBuy(someInputIsInvalid || !!error);
  }, [fiatAmount, tokenAmount, error]);

  const onFiatAmountChange = (amount) => {
    const coefficient = selectedPair?.quotation ?? 0;
    const calculated = amount ? (+amount / coefficient).toFixed(2) : amount;
    setTokenAmount(calculated.toString());
    setFiatAmount(amount);
  };

  const onTokenAmountChange = (amount) => {
    const coefficient = selectedPair?.quotation ?? 1;
    const calculated = amount ? (+amount * coefficient).toFixed(2) : amount;
    setFiatAmount(calculated.toString());
    setTokenAmount(amount);
  };

  const onFiatValidityChange = (validity) => {
    setError(validity.valid ? '' : valfidity.errorMessage || 'fiat validity error');
  };

  const getAuthHeader = (jwt) => ({
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  
  const getAddressNonceMessage = (address) => get(`/auth/${address}`);

  const authenticate = async () => {
    const { message } = await getAddressNonceMessage(address);
    await web3Enable('Reef Wallet App'); // TODO: name to const
    const [account] = await web3Accounts();
    const injector = await web3FromSource(account.meta.source);
    const signRaw = await injector?.signer?.signRaw;

    if (signRaw != null) {
      const { signature } = await signRaw({
        address: address,
        data: message,
        type: 'bytes',
      });

      return post('/jwt', { address: address, signature });
    }

    return undefined;
  }

  const createTrade = (payload, jwt) => post('/buy', payload, getAuthHeader(jwt));

  const buy = async () => {
    if (!address) {
      return;
    }
    let auth;

    try {
      auth = await authenticate();
      console.log(auth);
      if (!auth?.authenticated) {
        throw new Error();
      }
    } catch (_) {
      setError("Error occurred while authorizing");
    }

    try {
      if (auth?.authenticated && auth?.token) {
        const tradePayload = {
          address: address,
          fiatCurrency: selectedPair?.fiatCurrency,
          cryptoCurrency: selectedPair?.cryptoCurrency,
          orderAmount: +fiatAmount,
          merchantRedirectUrl: 'https://app.reef.io/',
        };
        const trade = await createTrade(tradePayload, auth.token);

        if (trade?.eternalRedirectUrl) {
          window.location.href = trade.eternalRedirectUrl;
        }
      }
    } catch (_) {
      setError('Error occured while creating a trade');
    }
  };

  return (
    <>
      <div className='card mx-360'>
        <div className='card-body'>
          <div className='input-box mt-3'>
            <AiOutlineUser  className='fiat-currency'/>
            <input type="text"
              value={address}
              placeholder="Account Address"
              disabled={disableInputs}
              onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className='input-box mt-3'>
            <Image className='fiat-currency' src={`https://s2.coinmarketcap.com/static/cloud/img/fiat-flags/${selectedFiatCurrency}.svg`} />
            <Dropdown>
              <Dropdown.Toggle variant=" ">
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {allPairs.length === 0 ? (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  allPairs.map((pair) => (
                    <Dropdown.Item key={pair.fiatCurrency}>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          if (parseInt(fiatAmount, 10) < pair.minLimit) {
                            setError(`Amount is too low. The lowest allowed value is ${pair.minLimit}`);
                          } else if (parseInt(fiatAmount, 10) > pair.maxLimit) {
                            setError(`Amount is too big. The highest allowed value is ${pair.maxLimit}`);
                          } else setError('');
                          setSelectedPair(pair);
                          setSelectedFiatCurrency(pair.fiatCurrency);
                          // this will change the value of reef tokens for newly selected currency
                          const coefficient = pair?.quotation ?? 0;
                          const calculated = fiatAmount ? (+fiatAmount / coefficient).toFixed(2) : fiatAmount;
                          setTokenAmount(calculated.toString());
                        }}
                      >
                        <div className='d-flex flex-row '>
                          <Image className='fiat-currency' src={`https://s2.coinmarketcap.com/static/cloud/img/fiat-flags/${pair.fiatCurrency}.svg`} />
                          <span className="pair--name">{pair.fiatCurrency}</span>
                        </div>
                      </div>
                    </Dropdown.Item>
                  ))
                )}
              </Dropdown.Menu>
            </Dropdown>
            <span className="pair--name">
              {selectedFiatCurrency}
              {' '}
            </span>
            <input type="text"
              value={fiatAmount}
              placeholder="0.0"
              min={selectedPair?.minLimit}
              max={selectedPair?.maxLimit}
              disabled={disableInputs}
              onChange={(e) => onFiatAmountChange(e.target.value)}
              onValidityChange={onFiatValidityChange} />
          </div>
          <div className='input-box mt-3'>
            <Image className='fiat-currency' src={'https://s2.coinmarketcap.com/static/img/coins/64x64/6951.png'} />
            <span className="pair--name ml-1">REEF</span>
            <input type="text"
              value={tokenAmount}
              placeholder="0.0"
              disabled={disableInputs}
              onChange={(e) => onTokenAmountChange(e.target.value)} />
          </div>
          <button className="w-100 btn-reef mt-3" disabled={disableBuy} onClick={buy}>{error || 'Buy'}</button>
        </div>
      </div >
    </>
  )
}

export default App
