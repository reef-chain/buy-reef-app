import { web3Enable } from "@reef-defi/extension-dapp";
import { REEF_EXTENSION_IDENT } from "@reef-defi/extension-inject";
import { ReefInjected, InjectedAccount } from "@reef-defi/extension-inject/types";
import { DeriveBalancesAccountData } from '@polkadot/api-derive/balances/types';
import { Provider, Signer } from '@reef-defi/evm-provider';
import { blake2AsU8a, decodeAddress } from '@polkadot/util-crypto';
import { u8aConcat, u8aEq, u8aToHex } from '@polkadot/util';
import { ethers, getAddress } from "ethers";
import { FrameSystemEventRecord as Event } from '@polkadot/types/lookup';

export interface ReefAccount {
  name: string;
  balance: BigInt;
  address: string;
  evmAddress: string;
  isEvmClaimed: boolean;
  signer?: Signer;
}

export async function getReefExtension(appName: string) {
    const extensionsArr = await web3Enable(appName);
    const extension = extensionsArr.find((e: any) => e.name === REEF_EXTENSION_IDENT);
    // @ts-ignore
    return extension as ReefInjected | undefined;
}

const getReefCoinBalance = async (
  address: string,
  provider: Provider,
): Promise<BigInt> => {
  const balance = await provider.api.derive.balances
    .all(address as any)
    .then((res: DeriveBalancesAccountData) => BigInt(res.freeBalance.toString(10)));
  return balance;
};

const computeDefaultEvmAddress = (address: string): string => {
  const publicKey = decodeAddress(address);

  const isStartWithEvm = u8aEq('evm:', publicKey.slice(0, 4));

  if (isStartWithEvm) {
    return getAddress(u8aToHex(publicKey.slice(4, 24)));
  }

  return getAddress(
    u8aToHex(blake2AsU8a(u8aConcat('evm:', publicKey), 256).slice(0, 20))
  );
}

export const queryEvmAddress = async (address: string, provider: Provider): Promise<{ evmAddress: string, isEvmClaimed: boolean }> => {
  const claimedAddress = await provider.api.query.evmAccounts.evmAddresses(address);
  if (!claimedAddress.isEmpty) {
    const evmAddress = getAddress(claimedAddress.toString());
    return { evmAddress, isEvmClaimed: true };
  }

  return { evmAddress: computeDefaultEvmAddress(address), isEvmClaimed: false };
}

export const toAddressShortDisplay = (address: string, size = 19): string => {
  return address.length < size
    ? address
    : `${address.slice(0, size - 5)}...${address.slice(address.length - 5)}`;
}

export const accountToReefAccount = async (account: InjectedAccount, provider: Provider): Promise<ReefAccount> => {
  const { evmAddress, isEvmClaimed } = await queryEvmAddress(account.address, provider);
  const balance = await getReefCoinBalance(account.address, provider);

  return {
    name: account.name || '',
    balance,
    address: account.address,
    evmAddress,
    isEvmClaimed,
  };
};

export const MIN_BALANCE = '5';

export const hasBalanceForBinding = (balance: BigInt): boolean => balance.valueOf() >= ethers.parseEther(MIN_BALANCE);

export const getSignersWithEnoughBalance = (signers: ReefAccount[], bindFor: ReefAccount): ReefAccount[] => {
  return signers?.length ? signers.filter(
    (sig) => sig.address !== bindFor.address && sig.balance.valueOf() > ethers.parseEther(MIN_BALANCE) * BigInt(2)
  ) : [];
}

const hexToAscii = (str1: string): string => {
  const hex = str1.toString();
  let str = '';
  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

export const captureError = (events: Event[]): string|undefined => {
  for (const event of events) {
    const eventCompression = `${event.event.section.toString()}.${event.event.method.toString()}`;
    if (eventCompression === 'evm.ExecutedFailed') {
      const eventData = (event.event.data.toJSON() as any[]);
      let message = eventData[eventData.length - 2];
      if (typeof message === 'string' || message instanceof String) {
        message = hexToAscii(message.substring(138));
      } else {
        message = JSON.stringify(message);
      }
      return message
    }
  }
  return undefined;
}

export const subscribeToBalance = async (signer: Signer, cb: (freeBalance: any)=>void): Promise<any> => {
  let address = await signer.getSubstrateAddress();
  const unsub = await signer.provider.api.query.system.account(address, ({ data: balance }) => {
      cb(BigInt(balance.free.toString()));
  });
  return unsub;
}