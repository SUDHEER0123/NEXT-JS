'use client';

import { Dialog, Transition, DialogPanel, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ActionIcon, Button, Textarea } from "@mantine/core";
import { Contract, IContract, IOrder } from "@/app/types";
import { differenceInDays } from "date-fns";
import './common.css';
interface UseCancelContractProps {
  contract?: IContract;
}

interface CancelContractProps extends UseCancelContractProps {
  isOpen: boolean;
  onClose: () => void;
}

const CancelContract: React.FC<CancelContractProps> = ({ isOpen, onClose, contract }) => {
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
                  <div
                    className="flex flex-col w-[548px] border bg-white items-center text-center gap-y-6 pt-12 cancel-order-modal-bg"
                  >
                    <Image src="/icons/alert-02.svg" alt="info" width={56} height={56} />
                    <div className="flex flex-col gap-y-3 w-full">
                      <span className="text-neutrals-high text-[18px] leading-[28px] font-medium w-full mb-8">
                        Do you want to Cancel the Contract?
                      </span>
                      <div className="flex flex-row w-full h-fit">
                        <Button className="w-full h-auto !bg-neutrals-high rounded-none p-6 font-medium" onClick={onClose}>
                          <p className="text-neutrals-background-default text-base">
                            Go Back
                          </p>
                        </Button>
                        <Button
                          className="w-full h-auto bg-indications-red rounded-none p-6 font-medium hover:bg-indications-red"
                          onClick={() => {
                            onClose();
                          }}
                        >
                          <p className="text-neutrals-background-default text-base">
                            Cancel Contract
                          </p>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <ActionIcon className="bg-brand-secondary p-1 rounded-none hover:bg-brand-secondar size-[48px] hover:bg-brand-secondary" onClick={onClose}>
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

export default CancelContract;


export const useCancelContract = (props: UseCancelContractProps) => {  
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = (
    <CancelContract isOpen={isOpen} onClose={() => setIsOpen(false)} {...props} />
  );
  
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    modalRef,
  };
}