import React, { useContext, useMemo } from 'react';
import {
  appState, availableNetworks, hooks, Network
} from '@reef-defi/react-lib';
import './Nav.css';
import { useHistory, useLocation } from 'react-router-dom';
import Uik from '@reef-chain/ui-kit';
import { appAvailableNetworks } from '../environment';
import NetworkSwitch from '../context/NetworkSwitch';

export interface Nav {
  display: boolean;
}

const Nav = ({ display }: Nav): JSX.Element => {
  const history = useHistory();
  const { pathname } = useLocation();
  const network: Network | undefined = hooks.useObservableState(appState.currentNetwork$);
  const mainnetSelected = network == null || network?.rpcUrl === availableNetworks.mainnet.rpcUrl;

  const networkSwitch = useContext(NetworkSwitch);

  const selectNetwork = (key: 'mainnet' | 'testnet'): void => {
    const toSelect = appAvailableNetworks.find((item) => item.name === key);
    networkSwitch.setSwitching(true);
    history.push("/");

    if (toSelect) {
      appState.setCurrentNetwork(toSelect);
    }
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
          {mainnetSelected ? <Uik.ReefLogo className="navigation__logo" /> : <Uik.ReefTestnetLogo className="navigation__logo" />}
        </button>

        {display && (
          <nav className="d-flex justify-content-end d-flex-vert-center">
            {network && (

              <Uik.Tabs
                className='mt-2 mb-2'
                value={selectedNetwork}
                options={[
                  { value: "mainnet", text: "Mainnet" },
                  { value: "testnet", text: "Testnet" }
                ]}
                onChange={selectNetwork}
              />
            )}
          </nav>
        )}
      </div>
    </div>
  );
};

export default Nav;
