import React, { useContext, useMemo } from 'react';
import {
  appState, availableNetworks, Components, hooks, Network, ReefSigner,
} from '@reef-defi/react-lib';
import './Nav.css';
import { Link, useHistory, useLocation } from 'react-router-dom';
import Uik from '@reef-chain/ui-kit';
import { saveSignerLocalPointer } from '../store/internalStore';
import { appAvailableNetworks } from '../environment';
import HideBalance from '../context/HideBalance';
import NetworkSwitch from '../context/NetworkSwitch';
import { localizedStrings } from '../l10n/l10n';

export interface Nav {
    display: boolean;
}

const Nav = ({ display }: Nav): JSX.Element => {
  const history = useHistory();
  const { pathname } = useLocation();
  const signer: ReefSigner|undefined|null = hooks.useObservableState(appState.selectedSigner$);
  const accounts: ReefSigner[]|undefined|null = hooks.useObservableState(appState.signers$);
  const network: Network|undefined = hooks.useObservableState(appState.currentNetwork$);
  const mainnetSelected = network == null || network?.rpcUrl === availableNetworks.mainnet.rpcUrl;

  const hideBalance = useContext(HideBalance);
  const networkSwitch = useContext(NetworkSwitch);

  const selectAccount = (index: number): void => {
    saveSignerLocalPointer(index);
    appState.setCurrentAddress(index != null ? accounts?.[index].address : undefined);
  };

  const selectNetwork = (key: 'mainnet' | 'testnet'): void => {
    const toSelect = appAvailableNetworks.find((item) => item.name === key);
    networkSwitch.setSwitching(true);
    history.push("/");

    if (toSelect) {
      appState.setCurrentNetwork(toSelect);
    }
  };

  const selectLanguage = (key: 'en'|'hi'):void => {
    localizedStrings.setLanguage(key);
    localStorage.setItem('app-language', key);
  };

  const selectedNetwork = useMemo(() => {
    const name = network?.name;

    if (name === 'mainnet' || name === 'testnet') {
      return name;
    }

    return undefined;
  }, [network]);

  return (
    <div className="nav-content navigation d-flex d-flex-space-between">
      <div className="navigation__wrapper">
        <button type="button" className="logo-btn" onClick={() => { history.push('/'); }}>
          { mainnetSelected ? <Uik.ReefLogo className="navigation__logo" /> : <Uik.ReefTestnetLogo className="navigation__logo" /> }
        </button>

        {display && (
          <nav className="d-flex justify-content-end d-flex-vert-center">
            {accounts && !!accounts.length && network && (

            <Components.AccountSelector
              accounts={accounts}
              selectedSigner={signer || undefined}
              selectAccount={selectAccount}
              onNetworkSelect={selectNetwork}
              selectedNetwork={selectedNetwork}
              isBalanceHidden={hideBalance.isHidden}
              showBalance={hideBalance.toggle}
              onLanguageSelect={selectLanguage}
            />
            )}
          </nav>
        )}
      </div>
    </div>
  );
};

export default Nav;
