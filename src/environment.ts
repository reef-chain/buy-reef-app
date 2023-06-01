import { availableNetworks, Network } from '@reef-defi/react-lib';

export const testnetOverride = { ...availableNetworks.testnet, rpcUrl: 'wss://rpc-testnet.reefscan.com/ws', verificationApiUrl: 'https://api-testnet.reefscan.info' } as Network;
// export const mainnetOverride = { ...availableNetworks.testnet, rpcUrl: 'wss://rpc.reefscan.com/ws', verificationApiUrl: 'https://api-testnet.reefscan.info' } as Network;
export const appAvailableNetworks = [availableNetworks.mainnet, testnetOverride];
export const getAppNetworkOverride = (network: Network): Network => appAvailableNetworks.find((net) => net.name === network.name) || network;
// export const appAvailableNetworks = [availableNetworks.mainnet, availableNetworks.testnet];
export const binanceConnectApiUrl = 'https://onramp.reefscan.info';
