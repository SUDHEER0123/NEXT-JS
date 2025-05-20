'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { ActionIcon } from '@mantine/core';
import clsx from 'clsx';

interface ISlideover {
  title: string;
  open: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  footer?: React.ReactNode;
  panelClassname?: string;
}

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 5L5 19M5 5L19 19" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
  </svg>
);

export const Slideover: React.FC<ISlideover> = ({ title, children, open, onClose, footer, panelClassname }) => {
  return (
    <Dialog open={open} onClose={() => onClose && onClose()} className="relative z-50">
      <div className="fixed inset-0" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden backdrop-blur-sm bg-[rgba(0,0,0,0.3)]">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex">
            <DialogPanel
              transition
              className={clsx(
                "pointer-events-auto w-fit transform transition duration-300 ease-in-out data-[closed]:translate-x-full sm:duration-300 shadow-drawer max-w-[500px] bg-neutrals-background-default",
                panelClassname
              )}
            >
              <div className="flex h-full flex-col divide-y divide-gray-200">
                <div className="flex items-center w-full">
                  <div className="flex items-center justify-between w-full bg-neutrals-high py-4">
                    <DialogTitle className="h-full sub_heading_3_semibold text-neutrals-background-default w-full px-6">{title}</DialogTitle>
                    <div className='px-2'>
                      <ActionIcon className='text-white bg-transparent hover:bg-[#707171] hover:rounded' onClick={() => onClose && onClose()}>
                        <CloseIcon />
                      </ActionIcon>
                    </div>
                  </div>
                </div>
                <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll w-full">
                  <div className="relative flex-1 px-3 sm:px-3">{children}</div>
                </div>
                <div className="flex shrink-0 justify-end">
                 {footer}
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}