import axios, { AxiosResponse } from 'axios';
import { BuyPair } from './interfaces';

const binanceConnectApiUrl = "https://onramp.reefscan.info";

const binanceConnectApi = axios.create({ baseURL: binanceConnectApiUrl });

export const fetchPairs = async (): Promise<any> => {
    try {
      const response: AxiosResponse<BuyPair[]> = await binanceConnectApi.get('/get-pairs');
      console.log(response.data);
      return response.data ;
    } catch (error) {
      console.error('Error fetching pairs:', error);
    }
  };