import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface ISearchModal {
  opened: boolean;
  children: React.ReactNode;
  onClose: () => void;
}

export const SearchModal: React.FC<ISearchModal> = ({ opened, onClose, children }) => {
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
};

export const useSearchModal = (props: ISearchModal) => {
  const [opened, { open, close }] = useDisclosure(false);

  const modalRef = (
    <SearchModal {...props} />
  );

  return {
    opened,
    open,
    close,
    searchModalRef: modalRef
  };
}