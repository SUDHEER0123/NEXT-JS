'use client';

import { Drawer } from "@/components/ui/Drawer/Drawer";
import { DrawerCard } from "./drawer-card";
import { useDisclosure } from "@mantine/hooks";
import { Button, DrawerProps } from "@mantine/core";
import { DropSelectFile } from "@/components/ui/Dropfile/Dropfile";
import Image from "next/image";
import { Contracts02Icon, InvoiceIcon, MentoringIcon, Money03Icon } from "@/assets/icons";
import { formatNumberWithCommas } from "@/utils/common";
import { Slideover } from "@/components/Slideover/Slideover";
import { usePDFView } from "@/components/PdfViewer/PdfViewer";

interface IUploadInvoice extends DrawerProps {
}

export const UploadInvoice: React.FC<IUploadInvoice> = ({ opened, onClose }) => {
  const { open: openContractPDF, close: closeContractPDF, modalRef: contractPdfModalRef } = usePDFView({ pdfUrl: '' });
  
  return (
    <Slideover
      title="Manage Customer Invoice"
      open={opened}
      onClose={onClose}
      footer={
        <div className="flex w-full overflow-y-hidden">
          <Button className="w-[250px] h-auto !bg-neutrals-high rounded-none font-medium" onClick={onClose}>
            <p className="text-neutrals-background-default text-base">
              Cancel
            </p>
          </Button>
          <Button
            className="w-[250px] h-auto !bg-brand-primary rounded-none p-6 font-medium"
            variant="transparent"
          >
            <p className="text-neutrals-background-default text-base">
              Confirm
            </p>
          </Button>
        </div>
      }
    >
      {contractPdfModalRef}
      <div className="flex flex-col gap-y-4 h-[calc(100vh-3.75rem)]">
        <div className="flex flex-col gap-y-4 grow px-1 py-3 overflow-y-auto">
          <DrawerCard title="Contract Details" icon="invoice-04">
            <div className="flex flex-col gap-y-4 items-start">
              <div className="flex gap-x-1 w-full">
                <Image src="/icons/car-02.svg" width={20} height={20} alt="car-02" />
                <p className="body_small_semibold text-neutrals-high">Vehicle</p>
                <div className="absolute right-8">
                  <Image src="/images/car-03.svg" width={150} height={100} alt="car" />
                </div>
              </div>
              <div className="flex flex-col gap-y-1 items-start w-full">
                <p className="body_large_semibold text-neutrals-high">DBS 770 Ultimate Coupe</p>
                <Button className="bg-transparent hover:bg-transparent p-0" onClick={() => openContractPDF()}>
                  <div className="flex gap-x-1 items-center border-b border-b-brand-primary pb-1">
                    <p>
                      <Image src="/icons/contracts-primary.svg" width={18} height={18} alt="IOrder" />
                    </p>
                    <p className="text-neutrals-high caption_small_regular">View Contract</p>
                  </div>
                </Button>
                <div className="h-[0.5px] w-full bg-neutrals-low" />
              </div>
              <div className="flex flex-col gap-y-4 w-full">
                <div className="flex justify-between items-center text-brand-primary">
                  <div className="flex gap-x-2 items-center w-full">
                    <Contracts02Icon width={20} height={20} />
                    <p className="body_small_semibold text-neutrals-high">Contract Number</p>
                  </div>
                  <p className="text-neutrals-high body_small_regular text-right w-full">32433</p>
                </div>

                <div className="flex justify-between items-center text-brand-primary">
                  <div className="flex gap-x-2 items-center w-full">
                    <MentoringIcon width={20} height={20} />
                    <p className="body_small_semibold text-neutrals-high">Sales Consultant</p>
                  </div>
                  <p className="text-neutrals-high body_small_regular text-right w-full">Baek Hyun</p>
                </div>

                <div className="flex justify-between items-center text-brand-primary">
                  <div className="flex gap-x-2 items-center w-full">
                    <InvoiceIcon width={20} height={20} />
                    <p className="body_small_semibold text-neutrals-high">Contract Value</p>
                  </div>
                  <p className="text-neutrals-high body_small_regular text-right w-full">{formatNumberWithCommas(500000000)}</p>
                </div>

                <div className="flex justify-between items-center text-brand-primary">
                  <div className="flex gap-x-2 items-center w-full">
                    <Money03Icon width={20} height={20} />
                    <p className="body_small_semibold text-neutrals-high">Open Balance</p>
                  </div>
                  <p className="text-neutrals-high body_small_regular text-right w-full">{formatNumberWithCommas(10000000)}</p>
                </div>
              </div>
            </div>
          </DrawerCard>
          <DrawerCard title="Customer Invoice" icon="invoice-04">
            <DropSelectFile subtitle="Upload or drag and drop invoice here" />
          </DrawerCard>
        </div>
      </div>
    </Slideover>
  );
};

export const useUploadInvoice = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const drawerRef = (
    <UploadInvoice opened={opened} onClose={close} />
  );

  return { opened, open, close, drawerRef };
};