import axios, { AxiosResponse } from 'axios';
import { BuyPair ,BuyPayload, GetAddressNonceMessageResponse, ReefAccount} from './interfaces';
import { web3Enable } from '@reef-defi/extension-dapp';
import { REEF_EXTENSION_IDENT } from "@reef-defi/extension-inject";
import { Provider } from '@reef-defi/evm-provider';
import { DeriveBalancesAccountData } from '@polkadot/api-derive/balances/types';

export const binanceConnectApiUrl = "https://onramp.reefscan.info";
export const reefTokenIconUrl = "https://s2.coinmarketcap.com/static/img/coins/64x64/6951.png";

const binanceConnectApi = axios.create({ baseURL: binanceConnectApiUrl });

export const fetchPairs = async (): Promise<BuyPair[]> => {
    try {
      const response: AxiosResponse<BuyPair[]> = await binanceConnectApi.get('/get-pairs');
      return response.data ;

    } catch (error) {
      console.error('Error fetching pairs:', error);
      return []
    }
  };

export const authenticate = async (address:string): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await binanceConnectApi.get(`/test/generate-jwt/${'5FTqemG94aV9UFyWHLtTgCVHvE2SnPyjjDJ95TpZQZNSuAka'}`);
      console.log(response);
      return response ;
    } catch (error) {
      console.error('Error fetching pairs:', error);
      return []
    }
  };

  const getAuthHeader = (jwt: string): Record<string, unknown> => ({
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

export const createTrade = async (buypayload:BuyPayload,token:string): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await binanceConnectApi.post('/buy',buypayload,getAuthHeader(token));
      console.log('binance BUY res=',response);
      return response ;
    } catch (error) {
      console.error('Error fetching pairs:', error);
      return []
    }
  };
export const generateJWT = async (address:string,signature:string): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await binanceConnectApi.post('/jwt',{ address, signature });
      console.log('binance JWT res=',response);
      return response.data ;
    } catch (error) {
      console.error('Error fetching pairs:', error);
      return []
    }
  };

export const getAddressNonceMessage = async(address:string)=>{
  const response:AxiosResponse<any> = await binanceConnectApi.get(`/auth/${address}`)
  return response.data;
}


export const getPairByFiat=(buyPairsList:BuyPair[], fiat:string):BuyPair=>{
  for(let i = 0;i<buyPairsList.length;i++){
    if(buyPairsList[i].fiatCurrency === fiat)return buyPairsList[i];
  }
  return buyPairsList[0];
}

export async function getReefExtension(appName: string) {
  const extensionsArr = await web3Enable(appName);
  const extension = extensionsArr.find((e: any) => e.name === REEF_EXTENSION_IDENT);
  // @ts-ignore
  return extension as ReefInjected | undefined;
}

export const accountToReefAccount = (account:any)=>{
  return {name:account.meta.name,address:account.address} as ReefAccount;
}

export const toAddressShortDisplay = (address: string, size = 19): string => {
  return address.length < size
    ? address
    : `${address.slice(0, size - 5)}...${address.slice(address.length - 5)}`;
}