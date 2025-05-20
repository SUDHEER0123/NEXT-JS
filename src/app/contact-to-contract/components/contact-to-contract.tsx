'use client';

import { Dialog, Transition, DialogPanel, TransitionChild } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Image from 'next/image';
import { ActionIcon, Button } from '@mantine/core';
import { IContract, IOrderView, IUser, OrderInventory } from '@/app/types';
import { formatNumberWithCommas } from '@/utils/common';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatDate } from '@/utils/dateFormatter';
import RejectOpportunity from './rejectOpportunity';
import { toast } from 'react-toastify';

interface UseContactToContractProps {
  isOpen: boolean;
  onClose: () => void;
  orderUid?: string;
}

const ContactToContract: React.FC<UseContactToContractProps> = ({ isOpen, onClose, orderUid }) => {
  const [openRejectModal, setOpenRejectModal] = useState<boolean>(false);
  const { data: order, isLoading: isLoadingOrder, error: errorGettingOrder } = useQuery({
    queryKey: ['order', orderUid],
    queryFn: () =>
      api.get(`/order/view/${orderUid}`).then((res) => res.data as IOrderView),
    enabled: !!orderUid,
  });

  const { data: orderInventory, isLoading: isLoadingOrderInventory, error: errorGettingOrderInventory } = useQuery({
    queryKey: ['orderInventory', order?.inventoryuid],
    queryFn: () =>
      api.get(`/order/inventory/${order?.inventoryuid}`).then((res) => res.data as OrderInventory),
    enabled: !!order?.inventoryuid,
  });

  const { data: contract, isLoading: isLoadingContract, error: errorGettingContract } = useQuery({
    queryKey: ['contract', order?.contractuid],
    queryFn: () =>
      api.get(`/contract/${order?.contractuid}`).then((res) => res.data as IContract),
    enabled: !!order?.contractuid,
  });

  const { data: contact, isLoading: isLoadingContact, error: errorGettingContact } = useQuery({
    queryKey: ['user', order?.consultantuid],
    queryFn: () =>
      api.get(`/user/${order?.consultantuid}`).then((res) => res.data as IUser),
    enabled: !!order?.consultantuid,
  });
  const updateApproval = () => {
    if (!order?.orderuid && !order?.contractuid) {
      toast.error('OrderUID and ContractUID is required.');
      return;
    };
    updateContractResponse({
      contractUid: order?.contractuid,
      orderUid: order?.orderuid,
      approved: true
    });
  }

  const { mutate: updateContractResponse, isPending: isUpdatingApproval } = useMutation({
    mutationKey: ['updateApproval', order?.orderuid],
    mutationFn: (data: any) => api.post(`/convert/contract-approval`, data),
    onMutate: async (data) => {
    },
    onSuccess(data, variables, context) {
      onClose();
    },
    onError(error, variables, context) {
      console.error('Error during Approval', error);
      toast.error('Error During Approval.');
    },
  });

  return (
    <>
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          {/* Background overlay */}
          <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
                  <div className="flex w-[65.65rem] h-[43.15rem]">
                    <div className='w-full h-full flex z-0 bg-transparent' style={{ backgroundImage: 'url(/images/bgImg.png)', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'contain' }}>
                      <div className="h-full flex flex-col justify-between w-1/2 relative p-10 z-10">
                        <div className="w-[133px] h-[125px] p-3 bg-neutrals-high absolute right-2 top-[6px] z-0">
                          <div className="flex flex-col gap-8">
                            <span className="font-normal text-neutrals-low leading-[15px] text-[10px]">PROSPECT</span>
                            <div className="flex flex-col">
                              <span className="font-semibold text-neutrals-low text-base">{order?.fullnameen}</span>
                              {/* <span className="font-normal text-neutrals-low leading-[18px] text-xs">{order?.primaryPhoneNo?.phoneNumber ?? '--'}</span> */}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-8 max-w-[311px]">
                          <Image src="/images/logo-white-new.svg" alt="logo" width={95.71} height={40} />
                          <div className="flex flex-col gap-2">
                            <span className="font-normal text-neutrals-low leading-[18px] text-xs">SUMMARY</span>
                            <span className="font-semibold text-neutrals-background-default leading-[28px] text-[30px]">Convert Opportunity to Contract</span>
                          </div>
                        </div>
                        <div className="w-full flex flex-col gap-3">
                          <Image src={order?.heroImage ?? "/images/carImage.png"} width={430} height={287} alt="car" />
                          <div className="w-full flex justify-between items-center border-l-2 border-brand-secondary">
                            <div className="w-1/2 flex flex-col pl-3">
                              <span className="font-normal text-neutrals-low leading-[15px] text-[10px]">Vehicle Model</span>
                              <span className="font-semibold text-neutrals-background-default leading-[24px] text-[20px]">{order?.model}</span>
                            </div>

                            <div className="w-1/3 flex flex-col">
                              <span className="font-normal text-neutrals-low leading-[15px] text-[10px]">Exterior Color</span>
                              <span className="font-normal text-neutrals-background-default text-sm">{order?.vehicleColor?.color}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="h-full w-1/2 relative z-10 bg-gradient-7">
                        <div className="w-full flex flex-col gap-[40px] p-6">
                          <div className="w-full flex flex-col gap-2">
                            <span className="font-semibold text-brand-secondary text-[10px] leading-[15px]">OPPORTUNITY DETAILS</span>
                            <div className="w-full flex justify-between items-center">
                              <div className="w-1/2 flex flex-col gap-[14px]">
                                <div className="flex flex-col">
                                  <span className="font-normal text-neutrals-low leading-4 text-[10px]">Opportunity No</span>
                                  <span className="font-normal text-neutrals-background-default leading-[18px] text-xs">{order?.opportunitynumber ?? '--'}</span>
                                </div>

                                <div className="flex flex-col">
                                  <span className="font-normal text-neutrals-low leading-4 text-[10px]">Order Type</span>
                                  <span className="font-normal text-neutrals-background-default leading-[18px] text-xs">{order?.type}</span>
                                </div>
                              </div>

                              <div className="w-1/2 flex flex-col gap-[14px]">
                                <div className="flex flex-col">
                                  <span className="font-normal text-neutrals-low leading-4 text-[10px]">Sales Consultant</span>
                                  <div className='flex items-center gap-1'>
                                    <Image src={contact?.avatar.trim() ? contact?.avatar : "/images/userImg.png"} width={16} height={16} alt="car" style={{borderRadius:'100%'}} />
                                    <span className="font-normal text-neutrals-background-default leading-[18px] text-xs">{contact?.firstName} {contact?.lastName}</span>
                                  </div>

                                </div>
                                <div className="flex flex-col">
                                  <span className="font-normal text-neutrals-low leading-4 text-[10px]">VIN Number</span>
                                  <span className="font-normal text-neutrals-background-default leading-[18px] text-xs">{order?.vinnumber ?? '--'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-full flex flex-col gap-2">
                            <span className="font-semibold text-brand-secondary text-[10px] leading-[15px]">CONTRACT DETAILS</span>
                            <div className="w-full flex justify-between items-center">
                              <div className="w-1/2 flex flex-col gap-[14px]">
                                <div className="flex flex-col">
                                  <span className="font-normal text-neutrals-low leading-4 text-[10px]">Contract Date</span>
                                  <span className="font-normal text-neutrals-background-default leading-[18px] text-xs">{formatDate(contract?.issueDate ?? '')}</span>
                                </div>
                              </div>
                              <div className="w-1/2 flex flex-col gap-[14px]">
                                <div className="flex flex-col">
                                  <span className="font-normal text-neutrals-low leading-4 text-[10px]">Contract Number</span>
                                  <span className="font-normal text-neutrals-background-default leading-[18px] text-xs">{order?.contractnumber ?? '--'}</span>
                                </div>
                              </div>
                            </div>

                            <div className="w-full mt-[6px] p-3 bg-gradient-7">
                              <div className="w-full flex justify-between pb-[5.5px] border-b border-b-shading-shading">
                                <span className="font-normal text-neutrals-low leading-4 text-[10px]">Vehicle Price</span>
                                <span className="font-normal text-neutrals-background-default leading-[18px] text-xs">{formatNumberWithCommas(orderInventory?.vehiclePrice)}</span>
                              </div>

                              <div className="w-full flex justify-between py-[5.5px] border-b border-b-shading-shading">
                                <span className="font-normal text-neutrals-low leading-4 text-[10px]">Option Price</span>
                                <span className="font-normal text-neutrals-background-default leading-[18px] text-xs">{formatNumberWithCommas(orderInventory?.optionPrice)}</span>
                              </div>

                              <div className="w-full flex justify-between py-[5.5px] border-b border-b-shading-shading">
                                <span className="font-normal text-neutrals-low leading-4 text-[10px]">Discount</span>
                                <span className="font-normal text-neutrals-background-default leading-[18px] text-xs">- {formatNumberWithCommas(contract?.discountAmount)}</span>
                              </div>

                              <div className="w-full flex justify-between pt-[5.5px]">
                                <span className="font-normal text-neutrals-low leading-4 text-[10px]">Deposit</span>
                                <span className="font-normal text-neutrals-background-default leading-[18px] text-xs">{formatNumberWithCommas(contract?.depositAmount)}</span>
                              </div>
                            </div>

                            <div className="w-full p-3 bg-gradient-7">
                              <div className="w-full flex justify-between">
                                <span className="font-normal text-neutrals-low leading-4 text-xs">Invoice Amount:</span>
                                <span className="font-normal text-brand-secondary_ext_1 text-sm">{formatNumberWithCommas(contract?.balance)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="w-full flex flex-col gap-2">
                            <span className="font-semibold text-brand-secondary text-[10px] leading-[15px]">DELIVERY DETAILS</span>
                            <div className="w-full flex justify-between items-start">
                              <div className="w-1/2 flex flex-col gap-[14px]">
                                <div className="flex flex-col">
                                  <span className="font-normal text-neutrals-low leading-4 text-[10px]">Expected Delivery Date</span>
                                  <span className="font-normal text-neutrals-background-default leading-[18px] text-xs">{formatDate(contract?.expectedDeliveryDate ?? '--')}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-normal text-neutrals-low leading-4 text-[10px]">Purchase Method</span>
                                  <span className="font-normal text-neutrals-background-default leading-[18px] text-xs">{contract?.paymentMethod ?? '--'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex w-full overflow-y-hidden absolute bottom-[4px] right-0">
                          <Button className="w-[250px] h-[72px] !bg-indications-red rounded-none font-medium" onClick={() => setOpenRejectModal(true)}>
                            <p className="text-neutrals-background-default text-base">Reject</p>
                          </Button>
                          <Button
                            className="w-[250px] h-[72px] !bg-brand-primary rounded-none p-6 font-medium"
                            onClick={updateApproval}
                            variant="transparent"
                          >
                            <p className="text-neutrals-background-default text-base">Approve</p>
                          </Button>
                        </div>
                      </div>

                    </div>
                    <ActionIcon className="bg-brand-secondary rounded-none hover:bg-brand-secondary w-[48px] h-[48px]" onClick={onClose}>
                      <Image src="/icons/cancel-01.svg" width={24} height={24} alt="close" />
                    </ActionIcon>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
      <RejectOpportunity handleRouteClose={onClose} order={order} isOpen={openRejectModal} onClose={() => setOpenRejectModal(false)} />
    </>
  );
};

export default ContactToContract;
