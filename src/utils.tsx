import axios, { AxiosResponse } from 'axios';
import { BuyPair ,BuyPayload} from './interfaces';

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

const hardCodedJWT:string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiNUZUcWVtRzk0YVY5VUZ5V0hMdFRnQ1ZIdkUyU25QeWpqREo5NVRwWlFaTlN1QWthIiwiaWF0IjoxNjg3MTkyMjY4LCJleHAiOjE2ODcxOTU4Njh9.tCjGahY-YODSSB-lWQSwTVRILcEsMC4xh2dvOdC0Q4Y";

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
  
export const createTrade = async (buypayload:BuyPayload): Promise<any> => {
    try {
      console.log(hardCodedJWT)
      const response: AxiosResponse<any> = await binanceConnectApi.post('/buy',buypayload,getAuthHeader(hardCodedJWT));
      console.log(response);
      return response ;
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