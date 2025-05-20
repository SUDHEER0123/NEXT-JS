'use client';

import { Dialog, Transition, DialogPanel, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";
import Image from "next/image";
import { ActionIcon, Button, Textarea } from "@mantine/core";
import { IOrderView } from "@/app/types";
import './common.css';
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";


interface RejectOpportunityProps {
  isOpen: boolean;
  onClose: () => void;
  handleRouteClose?: () => void;
  order?: IOrderView
}

const RejectOpportunity: React.FC<RejectOpportunityProps> = ({ isOpen, onClose, handleRouteClose, order }) => {
  const [cancellationReason, setCancellationReason] = useState('');
  const updateContractReject = () => {
    if (!order?.orderuid && !order?.contactuid) {
      toast.error("OrderUID and ContractUID is required.");
      return;
    }
    updateContractResponse({
      contractUid: order?.contractuid,
      orderUid: order?.orderuid,
      rejectionComment: cancellationReason,
      approved: false
    })
  }
  const { mutate: updateContractResponse, isPending: isUpdatingApproval } = useMutation({
    mutationKey: ['updateApproval', order?.orderuid],
    mutationFn: (data: any) => api.post(`/convert/contract-approval`, data),
    onMutate: async (data) => {
    },
    onSuccess(data, variables, context) {
      setCancellationReason('')
      onClose();
      handleRouteClose?.();
    },
    onError(error, variables, context) {
      console.error('Error during Reject.', error);
      toast.error('Error During Rejection.');
    },
  });

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                    className="flex flex-col w-[548px] bg-white items-center text-center gap-y-6 pt-12 cancel-order-modal-bg"
                  >
                    <Image src="/icons/alert-02.svg" alt="info" width={56} height={56} />
                    <div className="flex flex-col gap-y-3 w-full">
                      <span className="text-neutrals-high text-[18px] leading-[28px] font-medium w-full">
                        Do you want to Reject the Opportunity?
                      </span>
                      <div className="border-[1px] border-neutrals-low mt-4 mx-4">
                        <Textarea
                          variant="unstyled"
                          placeholder="Rejection reason..."
                          className="h-[80px] p-2 body_small_regular text-neutrals-medium bg-neutrals-background-surface"
                          classNames={{
                            input: 'text-neutrals-medium'
                          }}
                          onChange={(e) => setCancellationReason(e.currentTarget.value)}
                          value={cancellationReason}
                        />
                      </div>
                      <div className="flex flex-row w-full h-fit">
                        <Button className="w-full h-auto !bg-neutrals-high rounded-none p-6 font-medium" onClick={() => { onClose(); setCancellationReason('') }}>
                          <p className="text-neutrals-background-default text-base">
                            Go back
                          </p>
                        </Button>
                        <Button
                          className="w-full h-auto bg-indications-red rounded-none p-6 font-medium hover:bg-indications-red"
                          onClick={updateContractReject}
                          disabled={!cancellationReason?.length}
                        >
                          <p className="text-neutrals-background-default text-base">
                            Reject Opportunity
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

export default RejectOpportunity;
