'use client';

import { Dialog, Transition, DialogPanel, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ActionIcon, Button } from "@mantine/core";

import './common.css';

interface UseOptionAndConfigPDFViewProps {
  pdfUrl: string;
}

interface OptionAndConfigPDFViewProps extends UseOptionAndConfigPDFViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const OptionAndConfigPDFView: React.FC<OptionAndConfigPDFViewProps> = ({ isOpen, onClose, pdfUrl }) => {
  const router = useRouter();
  
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Background overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-[15px]" />
        </TransitionChild>

        {/* Modal content */}
        <div className="fixed inset-0 flex items-center justify-center p-2">
          <div className="flex flex-row">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel>
                <div className="flex">
                  <div className="flex flex-col w-[60vw] h-[90vh] pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    <iframe
                      src={pdfUrl}
                      className="w-full h-full"
                      frameBorder="0"
                    />
                    <div className="flex gap-x-2 bg-neutrals-high h-[74px] p-3 items-center justify-end">
                      <Button
                        leftSection={<Image src="/icons/printer.svg" width={20} height={20} alt="sign" />}
                        onClick={(e) => {
                          window.print();
                        }}
                        variant="unstyled"
                        className="bg-transparent rounded-none h-full hover:bg-transparent"
                      >
                        <p className="body_regular_semibold text-neutrals-background-defauilt">Print</p>
                      </Button>
                      <Button
                        leftSection={<Image src="/icons/share-05.svg" width={20} height={20} alt="sign" />}
                        onClick={onClose}
                        variant="unstyled"
                        className="bg-transparent rounded-none h-full hover:bg-transparent"
                      >
                        <p className="body_regular_semibold text-neutrals-background-defauilt">Send</p>
                      </Button>
                    </div>
                  </div>
                  <ActionIcon className="bg-brand-secondary p-1 rounded-none hover:bg-brand-secondary w-[48px] h-[48px]" onClick={onClose}>
                    <Image src="/icons/cancel-01.svg" width={24} height={24} alt="close" />
                  </ActionIcon>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OptionAndConfigPDFView;


export const useOptionAndConfigPDFView = (props: UseOptionAndConfigPDFViewProps) => {  
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = (
    <OptionAndConfigPDFView isOpen={isOpen} onClose={() => setIsOpen(false)} pdfUrl={props.pdfUrl} />
  );
  
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    modalRef,
  };
}