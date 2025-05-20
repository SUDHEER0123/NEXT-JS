'use client';

import { Dialog, Transition, DialogPanel, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ActionIcon, Button } from "@mantine/core";
import { TxtInput } from "../../TxtInput/text-input";

interface UseRenameFileProps {
  file: File | undefined;
  onFileRename: (filename: string) => void;
}

interface RenameFileProps extends UseRenameFileProps {
  isOpen: boolean;
  onClose: () => void;
}

const RenameFile: React.FC<RenameFileProps> = ({ isOpen, onClose, file, onFileRename }) => {
  const [filename, setFilename] = useState<string | null>(null);
  
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[999]" onClose={onClose}>
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
                    className="bg-white relative"
                  >
                    <div className="py-4 px-6 text-neutrals-high sub_heading_3_semibold">Rename File</div>
                    <div className="flex flex-col w-[548px] h-full gap-y-2">
                      <div className="flex flex-row items-center gap-x-2 pt-4 px-4">
                        <div className='bg-neutrals-background-surface p-2'>
                          <Image src={`/icons/${file?.name?.includes('image') ? 'image-01':'file-02'}.svg`} width={18} height={18} alt='file-attachment' />
                        </div>
                        <p className='body_small_regular text-neutrals-high'>{file?.name ?? 'No data'}</p>
                      </div>
                      <div className="py-4 px-6">
                        <div className="bg-neutrals-background-default border-t-[3px] border-t-brand-primary_ext_1 p-2.5 shadow-subtle-shadow2">
                          <TxtInput
                            placeholder="Enter new file name"
                            className="h-[72px]"
                            onChange={(e) => setFilename(e.currentTarget.value)}
                          />
                        </div>
                      </div>
                      <div className="flex mt-auto">
                        <Button className="w-full h-auto !bg-neutrals-high rounded-none p-6 font-medium" onClick={onClose}>
                          <p className="text-neutrals-background-default text-base">
                            Cancel
                          </p>
                          </Button>
                          <Button
                            className="w-full h-auto !bg-brand-primary rounded-none p-6 font-medium"
                            onClick={() => {
                              onFileRename && filename && onFileRename(filename);
                              onClose();
                            }}
                            variant="transparent"
                          >
                            <p className="text-neutrals-background-default text-base">
                              Confirm
                            </p>
                          </Button>
                        </div>
                    </div>
                  </div>
                  <ActionIcon className="bg-brand-secondary p-1 rounded-none hover:bg-brand-secondary size-[48px]" onClick={onClose}>
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

export default RenameFile;


export const useRenameFile = (props: UseRenameFileProps) => {  
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = (
    <RenameFile isOpen={isOpen} onClose={() => setIsOpen(false)} file={props.file} onFileRename={props.onFileRename} />
  );
  
  return {
    isOpen,
    open: () => {
      setIsOpen(true);
    },
    close: () => setIsOpen(false),
    modalRef,
  };
}