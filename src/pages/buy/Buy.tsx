import {
  appState, Components, hooks, ReefSigner,
} from '@reef-defi/react-lib';
import React, {
  useEffect, useState,
} from 'react';
import './Buy.css';
import { InputAmountValidity } from '@reef-defi/react-lib/dist/components/common/Input';
import Uik from '@reef-chain/ui-kit';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as api from './api-access';
import { localizedStrings as strings } from '../../l10n/l10n';
import { AuthenticationResponse, BuyPair, BuyPayload } from './models';

const {
  Button: ButtonModule,
  Card: CardModule,
  Input: InputModule,
  Display, Icons,
} = Components;
const {
  ComponentCenter, MX, MT, FlexRow,
} = Display;
const {
  CardHeader, SubCard, CardHeaderBlank, CardTitle, Card,
} = CardModule;
const { InputAmount } = InputModule;
const { Button } = ButtonModule;

const Buy = (): JSX.Element => {
  const FROM_FIAT_SYMBOL = 'EUR';
  const TOKEN_NAME = 'REEF';
  const iconUrl = {
    REEF: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6951.png',
  };
  const selectedSigner: ReefSigner | undefined | null = hooks.useObservableState(appState.selectedSigner$);

  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [allPairs, setAllPairs] = useState<BuyPair[]>([]);
  const [fiatAmount, setFiatAmount] = useState<string>('');
  const [selectedPair, setSelectedPair] = useState<BuyPair>();
  const [selectedFiatCurrency, setSelectedFiatCurrency] = useState<string>('EUR');
  const [disableBuy, setDisableBuy] = useState<boolean>(true);
  const [disableInputs, setDisableInputs] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    api.getPairs()
      .then((pairs) => {
        console.log('pairs', pairs);
        setAllPairs(pairs);
        const pair = pairs.filter((item: BuyPair) => item.fiatCurrency === FROM_FIAT_SYMBOL && item.cryptoCurrency === TOKEN_NAME);
        if (pair.length === 0) {
          throw new Error();
        }
        setSelectedPair(pair[0]);
      })
      .catch(() => {
        setError(strings.can_not_retrieve);
        setDisableInputs(true);
      });
  }, []);

  useEffect(() => {
    const isLastCharDigit = (num: string): boolean => /\d/.test(num.slice(-1));
    const isValidPositiveNumber = (num: string): boolean => num?.length > 0 && num != null && !Number.isNaN(+num) && +num > 0;

    const tokenAmountValid = isValidPositiveNumber(tokenAmount) && isLastCharDigit(tokenAmount);
    const fiatAmountValid = isValidPositiveNumber(fiatAmount) && isLastCharDigit(fiatAmount);
    const someInputIsInvalid = !tokenAmountValid || !fiatAmountValid;
    setDisableBuy(someInputIsInvalid || !!error);
  }, [fiatAmount, tokenAmount, error]);

  const onFiatAmountChange = (amount: string): void => {
    const coefficient = selectedPair?.quotation ?? 0;
    const calculated = amount ? (+amount / coefficient).toFixed(2) : amount;
    setTokenAmount(calculated.toString());
    setFiatAmount(amount);
  };

  const onTokenAmountChange = (amount: string): void => {
    const coefficient = selectedPair?.quotation ?? 1;
    const calculated = amount ? (+amount * coefficient).toFixed(2) : amount;
    setFiatAmount(calculated.toString());
    setTokenAmount(amount);
  };

  const onFiatValidityChange = (validity: InputAmountValidity): void => {
    setError(validity.valid ? '' : validity.errorMessage || strings.fiat_validity_error);
  };

  const buy = async (): Promise<void> => {
    if (!selectedSigner) {
      return;
    }
    let auth: AuthenticationResponse | undefined;

    try {
      auth = await api.authenticate(selectedSigner);
      if (!auth?.authenticated) {
        throw new Error();
      }
    } catch (_) {
      setError(strings.error_occured_while_authorizing);
    }

    try {
      if (auth?.authenticated && auth?.token) {
        const tradePayload = {
          address: selectedSigner.address,
          fiatCurrency: selectedPair?.fiatCurrency,
          cryptoCurrency: selectedPair?.cryptoCurrency,
          orderAmount: +fiatAmount,
          merchantRedirectUrl: 'https://app.reef.io/',
        } as BuyPayload;
        const trade = await api.createTrade(tradePayload, auth.token);

        if (trade?.eternalRedirectUrl) {
          window.location.href = trade.eternalRedirectUrl;
        }
      }
    } catch (_) {
      setError(strings.error_occured_while_creating_a_trade);
    }
  };

  return (
    <ComponentCenter>
      <Card>
        <CardHeader>
          <CardHeaderBlank />
          <CardTitle title={strings.buy_reef_tokens} />
          <CardHeaderBlank />
        </CardHeader>
        <p className="text-center"><small>Simply fill up Reef account with credit card</small></p>

        <SubCard>
          <MT size="1" />
          <FlexRow>
            <MT size="2" />
            <Icons.TokenIcon src={`https://s2.coinmarketcap.com/static/cloud/img/fiat-flags/${selectedFiatCurrency}.svg`} />
            <FontAwesomeIcon className="chevronDown" icon={faChevronDown} fontSize={10} onClick={() => setOpen(true)} />
            <MT size="2" />

            <span className="pair--name">
              {selectedFiatCurrency}
              {' '}
            </span>
            <div className="pair--dropdown">
              <Uik.Dropdown
                isOpen={isOpen}
                onClose={() => setOpen(false)}
              >
                {allPairs.length === 0 ? (
                  <Uik.Container vertical>
                    <Uik.Loading size="small" />
                  </Uik.Container>
                ) : (
                  allPairs.map((pair: BuyPair) => (
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
                        setOpen(false);
                      }}
                    >
                      <FlexRow key={pair.fiatCurrency}>
                        <MX size="2" />
                        <Icons.TokenIcon src={`https://s2.coinmarketcap.com/static/cloud/img/fiat-flags/${pair.fiatCurrency}.svg`} />
                        <MX size="3" />
                        <span className="pair--name">{pair.fiatCurrency}</span>
                      </FlexRow>
                    </div>
                  ))
                )}
              </Uik.Dropdown>
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
            <Icons.TokenIcon src={iconUrl.REEF} />
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
        <Button className="w-100" disabled={disableBuy} onClick={buy}>{ error || 'Buy'}</Button>
      </Card>

    </ComponentCenter>
  );
};

export default Buy;
