import { formatDate } from "@/utils/dateFormatter";
import Image from "next/image";
import { useState } from "react";

interface IDocuments {
  
}

export const MiddleDocuments: React.FC<IDocuments> = ({
}) => {
  const [documents, setDocuments] = useState([
    {
      title: 'Order Confirmation Summary',
      description: 'This agreement ensures transparency and protects both parties involved in the transaction.',
      uploadDate: '2024-08-24T00:00:00',
      uploadedBy: 'Baek Hyun'
    },
    {
      title: 'Vehicle Purchase Agreement',
      description: 'This agreement ensures transparency and protects both parties involved in the transaction.',
      uploadDate: '2024-08-24T00:00:00',
      uploadedBy: 'Baek Hyun'
    },
  ]);

  return (
    <div className="flex flex-col gap-y-3 p-4">
      {documents.map((document, index) => (
        <div key={index} className="flex items-start bg-neutrals-background-default border-[1px] border-neutrals-low shadow-subtle-shadow2 p-2">
          <div className="flex items-start gap-x-2 w-full">
            <div className="bg-neutrals-background-surface p-3">
              <Image src="/icons/file-02.svg" width={24} height={24} alt="file-02" />
            </div>
            <div className="flex flex-col mt-1">
              <div className="flex justify-between">
                <span className="body_small_semibold">{document.title}</span>
                <span className="text-brand-primary caption_small_semibold cursor-pointer pr-2">View Details</span>
              </div>
              <span className="caption_regular text-neutrals-medium">{document.description}</span>
              <span className="caption_small_regular text-neutrals-high mt-3">Uploaded on {formatDate(document.uploadDate)} by {document.uploadedBy}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
};