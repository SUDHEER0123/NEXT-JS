'use client';

import { formatDate } from "@/utils/dateFormatter";
import { ActionIcon } from "@mantine/core";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";

interface IFileList {
  files?: File[];
  allowedFileTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  onFileView?: (file: File) => void;
  onFileRename?: (file: File) => void;
  onFileDelete?: (file: File) => void;
  onFileUpload?: (file: File) => void;
  onFileUploadError?: (error: string) => void;
  onFileUploadSuccess?: (file: File) => void;
  onFileUploadProgress?: (progress: number) => void;
  onFileUploadComplete?: (file: File) => void;
  onFileUploadCancel?: () => void;
  onFileUploadStart?: () => void;
  onFileUploadPause?: () => void;
  onFileUploadResume?: () => void;
  onFileUploadRetry?: () => void;
  onFileUploadAbort?: () => void;
  onFileUploadTimeout?: () => void;
  onFileUploadResponse?: (response: any) => void;
  onFileUploadStatusChange?: (status: string) => void;
  onFileUploadErrorResponse?: (error: any) => void;
  disableFileUpload?: boolean;
  disableFileView?: boolean;
  disableFileRename?: boolean;
  disableFileDelete?: boolean;
  customDeleteIcon?: React.ReactNode;
  showActionButtonsBg?: boolean;
}

export const FileList: React.FC<IFileList> = ({
  allowedFileTypes,
  maxFileSize,
  maxFiles,
  onFilesChange,
  onFileView,
  onFileRename,
  onFileDelete,
  onFileUpload,
  onFileUploadError,
  onFileUploadSuccess,
  onFileUploadProgress,
  onFileUploadComplete,
  onFileUploadCancel,
  onFileUploadStart,
  onFileUploadPause,
  onFileUploadResume,
  onFileUploadRetry,
  onFileUploadAbort,
  onFileUploadTimeout,
  onFileUploadResponse,
  onFileUploadStatusChange,
  onFileUploadErrorResponse,
  disableFileDelete,
  disableFileRename,
  disableFileUpload,
  disableFileView,
  customDeleteIcon,
  showActionButtonsBg,
  ...props
}) => {
  const [fileToView, setFileToView] = useState<File | null>(null);
  const [fileToRename, setFileToRename] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>(props.files || []);

  useEffect(() => {
    setFiles(props.files || []);
  }
  , [props.files]);

  return (
    (files ?? []).map((file, idx) => (
      <div key={file.name} className="flex flex-col gap-y-2">
        <div className='flex items-center gap-x-2 justify-between'>
          <div className='flex gap-x-2'>
            <div className='bg-neutrals-background-surface p-2'>
              <Image src={`/icons/${file.name.includes('image') ? 'image-01':'file-02'}.svg`} width={18} height={18} alt='file-attachment' />
            </div>
            <div className='flex flex-col'>
              <p className='caption_regular text-neutrals-high'>{file.name}</p>
              <p className='caption_small_regular text-neutrals-medium'>Uploaded on {formatDate(file.lastModified, "EEE, dd MMM yyyy")}</p>
            </div>
          </div>
          <div className='flex gap-x-2'>
            {!disableFileView && (
              <ActionIcon
                variant='transparent'
                className='rounded-full bg-neutrals-background-shading size-[32px]'
                onClick={() => {
                  setFileToView(file);
                }}
              >
                <Image src="/icons/file-view.svg" width={18} height={18} alt="edit" />
              </ActionIcon>
            )}
            {!disableFileRename && (
              <ActionIcon
                variant='transparent'
                className='rounded-full bg-neutrals-background-shading size-[32px]'
                onClick={() => {
                  setFileToRename(file);
                }}
              >
                <Image src="/icons/pencil-edit-01.svg" width={18} height={18} alt="edit" />
              </ActionIcon>
            )}
            {!disableFileDelete && (
              <ActionIcon
                variant='transparent'
                className={clsx("rounded-full size-[32px]", showActionButtonsBg && "bg-neutrals-background-shading")}
                onClick={() => setFiles(files.filter((f) => f.name !== file.name))}
              >
                {!customDeleteIcon ? <Image src="/icons/delete-03.svg" width={18} height={18} alt="edit" /> : customDeleteIcon}
              </ActionIcon>
            )}
          </div>
        </div>
        {idx !== files.length - 1 && <div className='border-b border-b-neutrals-background-shading mb-2' />}
      </div>
    ))
  );
}