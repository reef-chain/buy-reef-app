import { Notify } from '@reef-defi/react-lib';
import { BigNumber, utils as ethUtils } from 'ethers';
import { toast } from 'react-toastify';

// eslint-disable-next-line
export const notify = (message: string, type: Notify='success'): void => {
  toast[type](message);
};