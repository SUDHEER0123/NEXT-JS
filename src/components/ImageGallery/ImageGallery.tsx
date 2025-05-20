'use client';

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import ReactImageGallery, { ReactImageGalleryProps } from 'react-image-gallery';
import clsx from 'clsx';
import { Fragment, useState } from 'react';
import { ActionIcon } from '@mantine/core';
import Image from 'next/image';
import "react-image-gallery/styles/css/image-gallery.css";
import './image-gallery.css';

export interface UseImageGalleryProps extends ReactImageGalleryProps {
}

export interface ImageGalleryProps extends UseImageGalleryProps, ReactImageGalleryProps {
  open: boolean;
  onClose: () => void;
}

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 5L5 19M5 5L19 19" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
  </svg>
);

export const ImageGallery: React.FC<ImageGalleryProps> = ({ items, onClose, open }) => {
  return (
    <Transition show={open} as={Fragment}>
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
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm" />
        </TransitionChild>

        {/* Modal content */}
        <div className="fixed inset-0 flex items-center justify-center flex">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className='flex'>
              <ReactImageGallery items={items} lazyLoad disableThumbnailScroll showBullets={false} showPlayButton={false} showNav={false} showFullscreenButton={false} />
              <ActionIcon className="bg-brand-secondary p-1 rounded-none hover:bg-brand-secondary size-[48px]" onClick={onClose}>
                <Image src="/icons/cancel-01.svg" width={24} height={24} alt="close" />
              </ActionIcon>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}

export const useImageGallery = (props: UseImageGalleryProps) => {
  const [open, setOpen] = useState(false);
  const { items } = props;

  const openGallery = () => {
    setOpen(true);
  }

  const closeGallery = () => {
    setOpen(false);
  }

  return {
    openGallery,
    closeGallery,
    imageGalleryRef: <ImageGallery items={items} open={open} onClose={closeGallery} />
  }
}