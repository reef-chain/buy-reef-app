import React, { useRef, useEffect } from 'react';

interface Children {
  children: React.ReactNode;
}

interface ModalProps extends Children {
  id?: string;
  displayModal?: boolean;
  setDisplayModal? : (displayModal:boolean)=>void;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  id = 'modal',
  displayModal = false,
  setDisplayModal
}): JSX.Element | null => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && setDisplayModal!) {   
        setDisplayModal(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  if (!displayModal) {
    return null;
  }

  return (
    <div
      className="modal fade"
      id={id}
      tabIndex={-1}
      aria-labelledby={id}
      aria-hidden="true"
      style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div ref={modalRef} style={{ backgroundColor: '#eeebf6', borderRadius: '8px', padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export const Title: React.FC<Children> = ({ children }): JSX.Element => (
  <div style={{'fontSize':'24px'}}>{children}</div>
);

export const ModalHeader: React.FC<Children> = ({ children }): JSX.Element => (
  <div>{children}</div>
);

export const ModalBody: React.FC<Children> = ({ children }): JSX.Element => (
  <div>{children}</div>
);

export const ModalFooter: React.FC<Children> = ({ children }): JSX.Element => (
  <div>{children}</div>
);

interface ModalCloseProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const ModalClose: React.FC<ModalCloseProps> = ({
  children,
  onClick = () => {},
  className,
}): JSX.Element => (
  <button
    type="button"
    className={className}
    onClick={onClick}
    data-bs-dismiss="modal"
    aria-label="Close"
    style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
  >
    {children}
  </button>
);

interface OpenModalButtonProps extends Children {
  id?: string;
  disabled?: boolean;
  className?: string;
}

export const OpenModalButton: React.FC<OpenModalButtonProps> = ({
  children,
  id = 'open-modal-button',
  disabled,
  className,
}): JSX.Element => (
  <button
    type="button"
    disabled={disabled}
    data-bs-toggle="modal"
    data-bs-target={`#${id}`}
    className={className}
  >
    <span>{children}</span>
  </button>
);

interface ConfirmationModalProps extends Children {
  id?: string;
  title: string;
  confirmFun: () => void;
  confirmBtnLabel?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  id = 'exampleModal',
  title,
  confirmFun,
  confirmBtnLabel = 'Confirm',
  children,
}): JSX.Element => (
  <Modal id={id} displayModal={true}>
    <ModalHeader>
      <Title>{title}</Title>
      <ModalClose />
    </ModalHeader>
    <ModalBody>{children}</ModalBody>
    <ModalFooter>
      <ModalClose onClick={confirmFun}>
        <span>{confirmBtnLabel}</span>
      </ModalClose>
    </ModalFooter>
  </Modal>
);

export default ConfirmationModal;
