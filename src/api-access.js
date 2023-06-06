import axios from 'axios';
import { web3FromSource, web3Enable, web3Accounts } from '@reef-defi/extension-dapp';

const binanceConnectApi = axios.create({ baseURL: 'https://onramp.reefscan.info' });

const getAuthHeader = (jwt) => ({
  headers: {
    Authorization: `Bearer ${jwt}`,
  },
});

async function get(url) {
  const response = await binanceConnectApi.get(url);
  return response.data;
}

async function post(url, payload, config) {
  return binanceConnectApi.post(url, payload, config)
    .then((response) => response.data);
}

export const getPairs = () => get('/get-pairs');

export const getNetwork = () => binanceConnectApi.get('/get-network');

export const createTrade = (payload, jwt) => post('/buy', payload, getAuthHeader(jwt));

export const getAddressNonceMessage = (address) => get(`/auth/${address}`);

export const authenticate = async (address) => {
  const { message } = await getAddressNonceMessage(address);
  await web3Enable('Buy Reef App'); // TODO: name to const
  const [account] = await web3Accounts();
  const injector = await web3FromSource(account.meta.source);
  const signRaw = await injector?.signer?.signRaw;

  if (signRaw != null) {
    const { signature } = await signRaw({
      address: address,
      data: message,
      type: 'bytes',
    });

    return post('/jwt', { address: address, signature });
  }

  return undefined;
};
