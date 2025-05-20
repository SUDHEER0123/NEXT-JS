'use client';

import { useDisclosure } from '@mantine/hooks';
import { Modal, ModalProps } from '@mantine/core';

interface IMantineModal extends ModalProps {
}

export const MantineModal: React.FC<IMantineModal> = ({ opened, onClose, children }) => {
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => onClose()}
        centered
        variant='unstyled'
      >
        {children}
      </Modal>
    </>
  );
}

export const useMantineModal = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const modalRef = (
    <MantineModal opened={opened} onClose={close} />
  );

  return {
    opened,
    open,
    close,
    modalRef
  };
}