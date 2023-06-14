import { ReactElement } from 'react';
import { ReefAccount } from '../../util';
import { Modal, ModalHeader, Title } from '../../Modal';
import Account from '../AccountBox/AccountBox';

interface AccountListModal {
  id: string;
  accounts: ReefAccount[];
  selectAccount: (index: number, signer: ReefAccount) => void;
  backButtonModalId?: string;
  title?: string | ReactElement;
  selectedAccount: string;
  displayModal:boolean;
  handleClose:(displayModal:boolean)=>void;
}

export const AccountListModal = ({
  id,
  accounts,
  selectAccount,
  selectedAccount,
  backButtonModalId,
  displayModal,
  handleClose,
  title = 'Select account',
}: AccountListModal): JSX.Element => {
  const accountsView = accounts.map((acc, index) => (
    <Account key={acc.address} isAccountSelected={selectedAccount==acc.address} account={acc} onClick={() => selectAccount(index, acc)}/>
  ));

  return (
    <Modal id={id} displayModal={displayModal} setDisplayModal={handleClose}>
      <ModalHeader>
        {!!backButtonModalId && (
          <button
            type="button"
            data-bs-target={backButtonModalId}
            data-bs-toggle="modal"
            data-bs-dismiss="modal"
          >
            {"<<"}
          </button>
        )}
        <Title>{title}</Title>
      </ModalHeader>
      <div>
        <ul style={{ height: '300px' }}>
          {accountsView}
        </ul>
      </div>
    </Modal>
  );
};
