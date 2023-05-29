import { createContext } from 'react';
import { PoolWithReserves } from '@reef-defi/react-lib';

export default createContext<PoolWithReserves[]>([]);
