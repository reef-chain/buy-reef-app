import {
  AddressToNumber, appState, graphql, hooks, TokenWithAmount,
} from '@reef-defi/react-lib';
import React, { useMemo } from 'react';
import NftContext from '../context/NftContext';
import PoolContext from '../context/PoolContext';
import TokenContext from '../context/TokenContext';
import TokenPrices from '../context/TokenPricesContext';
import Buy from './buy/Buy';

const ContentRouter = (): JSX.Element => {
  // const currentSigner: ReefSigner|undefined|null = hooks.useObservableState(appState.selectedSigner$);
  // const reefPrice = hooks.useObservableState(appState.reefPrice$);
  // const [tokenPrices, setTokenPrices] = useState({} as AddressToNumber<number>);
  // Its not appropriate to have token state in this component, but the problem was apollo client.
  // Once its declared properly in App move TokenContext in the parent component (App.tsx)

  const tokens = hooks.useObservableState<TokenWithAmount[]|null>(appState.tokenPrices$, []);
  const [nfts, nftsLoading] = hooks.useAllNfts();
  const apolloDex = hooks.useObservableState(graphql.apolloDexClientInstance$);
  const pools = hooks.useAllPools(apolloDex);
  const tokenPrices = useMemo(
    () => (tokens ? tokens.reduce((prices: AddressToNumber<number>, tkn) => {
      prices[tkn.address] = tkn.price;// eslint-disable-line
      return prices;
    }, {}) : []),
    [tokens],
  );

  return (
    <div className="content">
      <TokenContext.Provider value={{ tokens: tokens || [], loading: tokens == null }}>
        <NftContext.Provider value={{ nfts, loading: nftsLoading }}>
          <PoolContext.Provider value={pools}>
            <TokenPrices.Provider value={tokenPrices as AddressToNumber<number>}>
              <Buy/>
            </TokenPrices.Provider>
          </PoolContext.Provider>
        </NftContext.Provider>
      </TokenContext.Provider>
    </div>
  );
};

export default ContentRouter;
