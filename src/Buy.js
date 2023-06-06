import React, { useEffect, useState } from 'react';

import * as api from './api-access';
import { ComponentCenter, FlexRow, MT, MX } from './Display';
import { Card, CardHeader, CardHeaderBlank, CardTitle, SubCard } from './Card';
import Dropdown from './Dropdown/Dropdown';
import Container from './Container';
import Loading from './Loading';
import { InputAmount } from './Input';
import { Button } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import './Buy.css'
import { Input } from './Input';

export default function Buy() {
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
  const [isOpen, setOpen] = useState(false);
  const [address, setAddress] = useState('');

  useEffect(() => {
    api.getPairs()
      .then((pairs) => {
        console.log('pairs', pairs);
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
  }, [fiatAmount, tokenAmount, error, address]);

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
    setError(validity.valid ? '' : validity.errorMessage || 'fiat validity error');
  };

  const buy = async () => {
    if (!address) {
      return;
    }
    let auth;

    try {
      auth = await api.authenticate(address);
      if (!auth?.authenticated) {
        throw new Error();
      }
    } catch (_) {
      setError('Error occurred while authorizing');
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
        const trade = await api.createTrade(tradePayload, auth.token);

        if (trade?.eternalRedirectUrl) {
          window.location.href = trade.eternalRedirectUrl;
        }
      }
    } catch (_) {
      setError('Error occured while creating a trade');
    }
  };

  return (
    < ComponentCenter >
      <Card>
        <CardHeader>
          <CardHeaderBlank />
          <CardTitle title='Buy Reef' />
          <CardHeaderBlank />
        </CardHeader>
        <p className="text-center"><small>Simply fill up Reef account with credit card</small></p>

        <SubCard>
          <MT size="1" />
          <FlexRow>

            <div className="d-flex my-auto user-select-none">
              <img className="select-token-icon-size rounded-circle" src={iconUrl.REEF} />
            </div>
            <MX size="1" />
            <span className="pair--name">Account</span>
            <Input
              value={address}
              onChange={setAddress}
              placeholder="Account"
              disabled={disableInputs}
            />
          </FlexRow>
          <MT size="1" />
        </SubCard>
        <MT size="2" />

        <SubCard>
          <MT size="1" />
          <FlexRow>
            <MT size="2" />

            <div className="d-flex my-auto user-select-none">
              <img
                className="select-token-icon-size rounded-circle" src={`https://s2.coinmarketcap.com/static/cloud/img/fiat-flags/${selectedFiatCurrency}.svg`} />
            </div>
            <FontAwesomeIcon className="chevronDown" icon={faChevronDown} fontSize={10} onClick={() => setOpen(true)} />
            <MT size="2" />

            <span className="pair--name">
              {selectedFiatCurrency}
              {' '}
            </span>
            <div className="pair--dropdown">
              <Dropdown
                isOpen={isOpen}
                onClose={() => setOpen(false)}
              >
                {allPairs.length === 0 ? (
                  <Container vertical>
                    <Loading size="small" />
                  </Container>
                ) : (
                  allPairs.map((pair) => (
                    <div key={pair.fiatCurrency}
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
                        setOpen(false);
                      }}
                    >
                      <FlexRow>
                        <MX size="2" />
                        <div className="d-flex my-auto user-select-none">
                          <img className="select-token-icon-size rounded-circle" src={`https://s2.coinmarketcap.com/static/cloud/img/fiat-flags/${pair.fiatCurrency}.svg`} />
                        </div>
                        <MX size="3" />
                        <span className="pair--name">{pair.fiatCurrency}</span>
                      </FlexRow>
                    </div>
                  ))
                )}
              </Dropdown>
            </div>
            <InputAmount
              amount={fiatAmount}
              placeholder="0.0"
              min={selectedPair?.minLimit}
              max={selectedPair?.maxLimit}
              disabled={disableInputs}
              onAmountChange={onFiatAmountChange}
              onValidityChange={onFiatValidityChange}
            />
          </FlexRow>
          <MT size="1" />
        </SubCard>

        <MT size="2" />
        <SubCard>
          <MT size="1" />
          <FlexRow>

            <div className="d-flex my-auto user-select-none">
              <img className="select-token-icon-size rounded-circle" src={iconUrl.REEF} />
            </div>
            <MX size="1" />
            <span className="pair--name">REEF</span>
            <InputAmount
              amount={tokenAmount}
              placeholder="0.0"
              disabled={disableInputs}
              onAmountChange={onTokenAmountChange}
            />
          </FlexRow>
          <MT size="1" />
        </SubCard>
        <MT size="3" />
        <Button className="w-100" disabled={disableBuy} onClick={buy}>{error || 'Buy'}</Button>
      </Card>

    </ComponentCenter >)
}