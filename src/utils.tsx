import axios, { AxiosResponse } from 'axios';
import { BuyPair } from './interfaces';

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

export const getPairByFiat=(buyPairsList:BuyPair[], fiat:string):BuyPair=>{
  for(let i = 0;i<buyPairsList.length;i++){
    if(buyPairsList[i].fiatCurrency === fiat)return buyPairsList[i];
  }
  return buyPairsList[0];
}