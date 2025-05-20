import { useDropzone } from 'react-dropzone';
import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { ActionIcon, Button } from '@mantine/core';
import { formatDate } from 'date-fns';
import { useRenameFile } from './components/rename-file';
import { ImageIcon } from '@/assets/icons';
import { usePDFView } from '@/components/PdfViewer/PdfViewer';

interface DropSelectFileProps {
  subtitle?: string;
  title?: string;
  disable?: boolean;
  imageOnly?: boolean;
  accept?: string;
  supportedFormats?: string[];
  maxUploads?: number;
  maxFileSize?: string;
  filesLabel?: string;
  customImage?: string;
  label?: string;
  titleClassName?: string;
  imagesOnTop?: boolean;
  value?: { date: Date; file: File, name: string }[];
  onChange?: (files: { date: Date; file: File }[]) => void;
  uploadDisabled?: boolean;
  hideViewIcon?:boolean
}

export const DropSelectFile: React.FC<DropSelectFileProps> = ({
  subtitle,
  title,
  disable,
  imageOnly,
  accept,
  maxUploads,
  supportedFormats,
  maxFileSize,
  customImage,
  filesLabel,
  label,
  titleClassName,
  imagesOnTop,
  value = [],
  onChange,
  uploadDisabled,
  hideViewIcon = false
}) => {
  const files = value ?? [];
  const [fileToRename, setFileToRename] = useState<File>();
  const [fileToView, setFileToView] = useState<File>();
  const { open: openPdfViewer, close: closePdfViewer, modalRef: pdfViewerModalRef } = usePDFView({ pdfUrl: fileToView?.name ?? '' });

  const {
    open: openRenameFileModal,
    close: closeRenameFileModal,
    modalRef: renameModalRef,
  } = useRenameFile({
    file: fileToRename,
    onFileRename: (filename) => {
      if (!filename || !fileToRename) return;

      const updated = files.map((f) =>
        f.file.name === fileToRename.name
          ? {
              ...f,
              file: new File([f.file], filename, { type: f.file.type }),
            }
          : f
      );

      onChange?.(updated);
      closeRenameFileModal();
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (
        acceptedFiles.length > 0 &&
        (!maxUploads || files.length < maxUploads)
      ) {
        const newFiles = acceptedFiles.map((file) => ({
          date: new Date(),
          file,
          name: file.name,
        }));

        onChange?.([...files, ...newFiles].slice(0, maxUploads));
      } else {
        // replace uploaded file if only 1 is allowed and user uploads again
        if (maxUploads === 1 && files.length === 1) {
          const updatedFiles = acceptedFiles.map((file) => ({
            date: new Date(),
            file,
            name: file.name,
          }));
          onChange?.(updatedFiles);
        } else {
          // Replace last file if maxUploads is reached
          const updatedFiles = [...files.slice(0, -1), {
            date: new Date(),
            file: acceptedFiles[0],
            name: acceptedFiles[0].name,
          }];
          onChange?.(updatedFiles);
        }
      }
    },
    [files, maxUploads, onChange]
  );

  useEffect(() => {
    if (fileToRename) {
      openRenameFileModal();
    } else if (fileToView) {
      // Optional: open file viewer
      if (fileToView.type === 'application/pdf') {
        openPdfViewer();
      }
    }
  }, [fileToRename, fileToView]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const labelText = subtitle;

  return (
    <div className='flex flex-col gap-y-2'>
      {renameModalRef}
      {label && <p className='body_small_semibold text-neutrals-high'>{label}</p>}

      <div
        className={clsx('flex flex-col items-center', {
          'bg-gray-100': isDragActive,
          'h-fit': subtitle,
        })}
        {...getRootProps()}
      >
        <input {...getInputProps({})} accept={accept} />
        {!uploadDisabled && (
          <div className="flex flex-col items-center text-center justify-center w-full py-8 px-4 gap-y-6 border-[0.5px] h-auto border-neutrals-medium border-dashed">
            {!imageOnly && !customImage && <Image src="/icons/file-attachment-02.svg" width={32} height={32} alt="file-attachment" />}
            {imageOnly && !customImage && (
              <ImageIcon className='text-neutrals-medium' width={32} height={32} strokeWidth='0.7' />
            )}
            {customImage && (
              <Image src={customImage} width={32} height={32} alt="file-attachment" />
            )}

            <div className='flex flex-col gap-y-2 w-1/2 justify-center text-center items-center'>
              {title && <p className={clsx("body_small_semibold text-neutrals-high", titleClassName)}>{title}</p>}
              <label className={clsx(
                  'font-normal text-neutrals-high hover:cursor-pointer w-[162px] text-[12px] leading-[18px]',
                  '!text-neutrals-medium caption_regular w-full'
                )}
              >  
                {labelText}
              </label>
          </div>

          <Button
            leftSection={<Image src="/icons/upload-05.svg" width={20} height={20} alt="upload" />}
            variant='unstyled'
            className='h-full text-center font-medium text-brand-primary bg-neutrals-background-surface py-2 px-3 text-[12px] leading-[18px] tracking-[0.02em] hover:bg-neutrals-background-surface hover:text-brand-primary'
          >
            Upload
          </Button>
          </div>
        )}

        {!uploadDisabled && (
          <div className='flex w-full'>
            {supportedFormats && (
              <p className='caption_regular text-neutrals-high mt-2 mr-auto'>Supported formats: {supportedFormats.map(s => s.toUpperCase()).join(', ')}</p>
            )}
            {maxFileSize && (
              <p className='caption_regular text-neutrals-medium mt-2 ml-auto'>Max file size: {maxFileSize}</p>
            )}
          </div>
        )}
      </div>

      {!imageOnly && (
        <div className='flex flex-col gap-y-2'>
          {files.map((fileData) => (
            <div key={fileData.file.name}>
              <div className='flex flex-row items-center gap-x-2 justify-between'>
                <div className='flex gap-x-2'>
                  <div className='bg-neutrals-background-surface p-2'>
                    <Image src={`/icons/${fileData.file.name.includes('image') ? 'image-01' : 'file-02'}.svg`} width={18} height={18} alt='file-attachment' />
                  </div>
                  <div className='flex flex-col'>
                    <p className='caption_regular text-neutrals-high'>{fileData.file.name}</p>
                    <p className='caption_small_regular text-neutrals-medium'>Uploaded on {formatDate(fileData.date, "EEE, dd MMM yyyy")}</p>
                  </div>
                </div>
                <div className='flex gap-x-2'>
                  {!hideViewIcon && 
                  <ActionIcon variant='transparent' className='rounded-full bg-neutrals-background-shading size-[32px]' onClick={() => setFileToView(fileData.file)}>
                    <Image src="/icons/file-view.svg" width={18} height={18} alt="view" />
                  </ActionIcon>
                  }
                  <ActionIcon variant='transparent' className='rounded-full bg-neutrals-background-shading size-[32px]' onClick={() => setFileToRename(fileData.file)}>
                    <Image src="/icons/pencil-edit-01.svg" width={18} height={18} alt="edit" />
                  </ActionIcon>
                  <ActionIcon variant='transparent' className='rounded-full bg-neutrals-background-shading size-[32px]' onClick={() => onChange?.(files.filter(f => f.file.name !== fileData.file.name))}>
                    <Image src="/icons/delete-03.svg" width={18} height={18} alt="delete" />
                  </ActionIcon>
                </div>
              </div>
              <div className='p-2 border-b border-b-neutrals-background-shading' />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const useFileBase64 = () => {
  const [base64, setBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const convertToBase64 = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const result = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
      });
      setBase64(result);
      return result;
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { base64, convertToBase64, loading, error };
};