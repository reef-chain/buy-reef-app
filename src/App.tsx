import { useEffect, useRef, useState } from 'react';
import { decodeAddress } from '@polkadot/util-crypto';
import { web3FromAddress } from '@reef-defi/extension-dapp';
import { InjectedAccount, ReefSignerResponse, ReefVM } from "@reef-defi/extension-inject/types";
import { Signer } from '@reef-defi/evm-provider';
import { ethers } from 'ethers';
import { Buffer } from 'buffer';
import { ReefAccount, getReefExtension, getSignersWithEnoughBalance,  accountToReefAccount } from './util';
import Account from './components/AccountBox/AccountBox';
import { AccountListModal } from './components/AccountListModal/AccountListModal';
import Loader from './components/Loader/Loader';
import GradientButton from './components/GradientButton/GradientButton';
import Navbar from './components/Navbar/Navbar';
import TextButton from './components/TextButton/TextButton';

interface Status {
  inProgress: boolean;
  message?: string;
}

const App = (): JSX.Element => {
  const [accounts, setAccounts] = useState<ReefAccount[]>([]);
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [isReefExtensionInstalled, setIsReefExtensionInstalled] = useState<boolean>(false);
  const [selectedSigner, setSelectedSigner] = useState<Signer>();
  const [selectedReefSigner, setSelectedReefSigner] = useState<ReefAccount>();
  const selectedReefSignerRef = useRef(selectedReefSigner);

  useEffect(() => {
    getAccounts();
  }, []);

  // Update selectedReefSigner
  useEffect(() => {
    if (selectedSigner) {
      const account = accounts.find(
        (account: ReefAccount) => account.address === selectedSigner._substrateAddress
      );
      if (account) {
        account.signer = selectedSigner;
        setSelectedReefSigner(account);
        selectedReefSignerRef.current = account;
        return;
      }
    }
    setSelectedReefSigner(undefined);
    selectedReefSignerRef.current = undefined;
  }, [selectedSigner, accounts]);

  // Update transferBalanceFrom and accountsWithEnoughBalance
  useEffect(() => {
    if (selectedReefSigner) {
      const fromAccounts = getSignersWithEnoughBalance(accounts, selectedReefSigner);
    } else {
    }
  }, [accounts, selectedReefSigner]);

  // Get accounts from Reef extension and subscribe to changes
  const getAccounts = async (): Promise<any> => {
    try {
      let reefExtension = await getReefExtension('Reef EVM connection');
      if (!reefExtension) {
        // If first attempt failed, wait .5 seconds and try again
        await new Promise( resolve => setTimeout(resolve, 500));
        reefExtension = await getReefExtension('Reef EVM connection');
      }
      if (!reefExtension) {
        throw new Error('Install Reef Chain Wallet extension for Chrome or Firefox. See docs.reef.io');
      }
      if(reefExtension){
        setIsReefExtensionInstalled(true);
      }
      const provider = await reefExtension.reefProvider.getNetworkProvider();
      const accounts = await reefExtension.accounts.get();
        const _reefAccounts = await Promise.all(accounts.map(async (account: InjectedAccount) =>
        accountToReefAccount(account, provider)
      ));
      setAccounts(_reefAccounts);

      reefExtension.accounts.subscribe(async (accounts: InjectedAccount[]) => {
        console.log("accounts cb =", accounts);
        const _accounts = await Promise.all(accounts.map(async (account: InjectedAccount) =>
          accountToReefAccount(account, provider)
        ));
        setAccounts(_accounts);
      });

      reefExtension.reefSigner.subscribeSelectedSigner(async (sig:ReefSignerResponse) => {
        console.log("signer cb =", sig);
        setSelectedSigner(sig.data);
      }, ReefVM.NATIVE);

    } catch (err: any) {
      console.error(err);
    }
  }

  const AccountModalList = ()=>{
    return <AccountListModal id={'select-account'} accounts={accounts} displayModal={displayModal} handleClose={()=>setDisplayModal(false)} selectedAccount={selectedReefSigner?.address!} selectAccount={(_: any, selected: ReefAccount): void => {
      setSelectedReefSigner(selected);
      setDisplayModal(false);
    }} />
  }

  return (
    <div>
      <Navbar account={selectedReefSigner!} shouldDisplayBtn={isReefExtensionInstalled && selectedReefSigner!=undefined} switchAccount={()=>setDisplayModal(true)}/>
      {isReefExtensionInstalled ?
      <div>
        {selectedReefSigner?
        <div>
          <AccountModalList />
        </div>
        :<Loader text='loading onramp app ...'/>}
      </div>
      :'Install REEF Extension first'
      }
      
    </div>
  );
};

export default App;
