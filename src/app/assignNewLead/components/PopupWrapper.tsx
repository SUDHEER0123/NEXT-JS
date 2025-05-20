'use client';
import { useRouter } from "next/navigation";
import { Fragment, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Dialog, Transition, DialogPanel, TransitionChild } from '@headlessui/react';
import { ActionIcon, Button, Textarea } from '@mantine/core';
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { IContact, ILead } from "@/app/types";
import { formatMobileNumber } from "@/utils/common";
import { useAppDataStore } from "@/app/app.store";
import { Select } from "@/components/ui/Select/Select";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';

const PopUpWrapper: React.FC<{ id: string }> = ({ id }) => {
    const router = useRouter()
    const [value, setValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('');
    const [noteText, setNoteText] = useState<string | null>(null)
    const [open, setOpen] = useState(false);
    const { users, modelTypes } = useAppDataStore()
    useEffect(() => {
        if (id) {
            setIsOpen(true);
        }
    }, [id]);

    const onClose = () => {
        setIsOpen(false);
        router.back();
    };
    const { data: leadData, isLoading: isLoadingLead, error: errorGettingLead } = useQuery({
        queryKey: ['leadId', id],
        queryFn: () =>
            api.get(`/contact/lead/${id}`).then((res) => res.data as ILead),
        enabled: !!id,
    });

    const { data: contactData, isLoading: isLoadingContact, error: errorGettingContact } = useQuery({
        queryKey: ['contact', leadData?.contactUid],
        queryFn: () =>
            api.get(`/contact/${leadData?.contactUid}`).then((res) => res.data as IContact),
        enabled: !!leadData?.contactUid,
    });

    useEffect(() => {
        if (leadData) {
            setSelected(leadData?.priority ?? '')
        }
    }, [leadData])

    const salesConsultants = useMemo(() => {
        return Array.from(
            new Set(
                users?.map(
                    ({ lastName, firstName, avatar, uid }) => ({
                        value: uid, label: `${firstName} ${lastName}`,
                        icon: (
                            <Image
                                src={avatar?.trim() ? avatar : '/images/userImg.png'}
                                width={32}
                                height={32}
                                alt="avatar"
                                style={{ backgroundColor: 'transparent', borderRadius: '100%' }}
                            />
                        )
                    })
                )
            )
        );
    }, [users]);

function getDisplayNameByUid(uid: string): string | undefined {
  const found = modelTypes && modelTypes.find(model => model.uid === uid);
  return found?.displayName;
}

    const priorities = [
        {
            label: 'CUSTOMER',
            value: 'Customer',
            textColor: 'text-[#00665E]',
            bgColor: 'bg-[#EDFCF5]',
        },
        {
            label: 'HOT LEAD',
            value: 'Hot',
            textColor: 'text-[#FFEBEB]',
            bgColor: 'bg-[#D60000]',
        },
        {
            label: 'WARM LEAD',
            value: 'Warm',
            textColor: 'text-[#161A11]',
            bgColor: 'bg-[#CEDC00]',
        },
        {
            label: 'COLD LEAD',
            value: 'Cold',
            textColor: 'text-[#FFFFFF]',
            bgColor: 'bg-[#3860BE]',
        }
    ];

    const handleChange = (val: string) => {
        setSelected(val);
        setOpen(false);
    };

    const assignLead = () => {
        if (!id) {
            toast.error('Lead UID and Sales Consultant are required.');
            return;
        }
        if (!value) {
            toast.error('Sales Consultant is required.');
            return;
        }
        
    const updatedPayload = {
        ...leadData,
        priority: selected,
        ...(noteText && {
            notes: [
                {
                    body: noteText,
                    userUid: value,
                },
            ],
        }),
        updatedDate: new Date().toISOString(),
    };
        updateLead(updatedPayload);
    };


    const { mutate: updateLead, isPending: isUpdating } = useMutation({
        mutationKey: ['updateLead', id],
        mutationFn: (data: any) => api.put(`/contact/lead`, data),
        onSuccess: () => {
            assignLeadMutate();
        },
        onError: (error) => {
            console.error('Lead update failed:', error);
            toast.error('Lead update failed.');
        },
    });

    const { mutate: assignLeadMutate, isPending: isUpdatingApproval } = useMutation({
        mutationKey: ['updateApproval', id],
        mutationFn: () => api.get(`/contact/lead/assign/${id}?userUid=${value}`),
        onSuccess: () => {
            toast.success('Lead assigned successfully.');
            onClose();
        },
        onError: (error) => {
            console.error('Lead assignment failed:', error);
            toast.error('Lead assignment failed.');
        },
    });

    const selectedPriority = priorities.find(p => p.value === selected);

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Background overlay */}
                <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-10  backdrop-blur-[15px]" />
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
                                <div className="flex w-[34.25rem] h-[33.625rem]">
                                    <div className="bg-white flex flex-col border border-gradient-7 justify-between w-full h-full relative">
                                        <div className="p-4 flex flex-col gap-4">
                                            <div className="w-full flex justify-between">
                                                <span className="font-semibold text-2xl text-neutrals-high">
                                                    Assign New Lead
                                                </span>
                                                <div className="max-h-fit flex justify-center gap-[2px] items-center rounded-[100px]">
                                                    <div className="relative inline-block text-left">
                                                        <button
                                                            type="button"
                                                            onClick={() => setOpen(prev => !prev)}
                                                            className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold focus:outline-none
                                                                ${selectedPriority?.bgColor ?? 'bg-gray-100'} 
                                                                ${selectedPriority?.textColor ?? 'text-gray-800'}
                                                                `}
                                                        >
                                                            {selectedPriority?.label || 'Select Priority'}

                                                            <svg width="8" height="6" className="ml-2" viewBox="0 0 8 6" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M8.001 0.75H0.000976562L4.001 5.25L8.001 0.75Z" fill="currentColor" />
                                                            </svg>


                                                        </button>

                                                        {open && (
                                                            <div className="absolute -left-14 mt-2 w-[180px] px-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                                                                <div className="py-[2px] max-h-60 flex flex-col gap-1 items-start overflow-auto">
                                                                    {priorities.map(priority => (
                                                                        <div className="w-full flex flex-col" key={uuidv4()}>
                                                                            <div className="w-full flex justify-between cursor-pointer" onClick={() => handleChange(priority.value)}>
                                                                                <div
                                                                                    className={`max-w-fit text-left px-4 py-1.5 text-nowrap text-xs  border flex items-center rounded-full my-1 
                                                                              ${priority.bgColor} ${priority.textColor} hover:opacity-80`}
                                                                                >
                                                                                    {priority.label}
                                                                                </div>
                                                                                <Image src={`/icons/${selected === priority.value ? 'tick' : 'tick-blank'}.svg`} width={18} height={18} alt="tick" />
                                                                            </div>
                                                                            <div className="border-b border-neutrals-low"></div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full min-h-[126px] p-3" style={{ backgroundImage: 'url(/images/bgImgAssignLead.png)', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'contain' }}>
                                                <div className="w-full h-full flex justify-between">
                                                    <div className="h-full flex flex-col justify-between">
                                                        <div className="flex flex-col">
                                                            <span className='font-semibold text-[18px] leading-[28px] text-neutrals-high'>
                                                                {contactData?.fullNameEN}
                                                            </span>
                                                            <span className="text-xs font-normal text-neutrals-medium">
                                                                {formatMobileNumber(contactData?.mobileNo?.phoneNumber ?? '--')}
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-normal text-xs text-neutrals-medium">
                                                                    Vehicle Interest:
                                                                </span>
                                                                <span className="text-xs font-semibold text-neutrals-high">
                                                                    {leadData?.vehicleInterest?.length
                                                                        ? [getDisplayNameByUid(leadData?.vehicleInterest[0]), getDisplayNameByUid(leadData?.vehicleInterest[1])].filter(Boolean).join(', ')
                                                                        : '--'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-normal text-xs text-neutrals-medium">
                                                                    Current Vehicle:
                                                                </span>
                                                                <span className="text-xs font-semibold text-neutrals-high">
                                                                    {leadData?.currentVehicle ?? '--'}
                                                                </span>
                                                            </div>

                                                        </div>

                                                    </div>

                                                    <div className="h-full flex flex-col justify-between">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] leading-[15px] font-normal text-neutrals-medium">
                                                                Address 1:
                                                            </span>
                                                            <span className="text-[10px] leading-[15px] font-semibold text-neutrals-high">
                                                                {contactData?.addresses?.[0]?.streetAddress1}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] leading-[15px] font-normal text-neutrals-medium">
                                                                Address 2:
                                                            </span>
                                                            <span className="text-[10px] leading-[15px] font-semibold text-neutrals-high">
                                                                {contactData?.addresses?.[0]?.streetAddress2}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] leading-[15px] font-normal text-neutrals-medium">
                                                                City:
                                                            </span>
                                                            <span className="text-[10px] leading-[15px] font-semibold text-neutrals-high">
                                                                {contactData?.addresses?.[0]?.city}
                                                            </span>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className="flex gap-x-2 w-full cursor-pointer z-10">
                                                <Select
                                                    items={salesConsultants}
                                                    withOptionsDivider={true}
                                                    placeholder="Assign Sales Consultant"
                                                    withDivider={true}
                                                    showLabel
                                                    showSelectOnLabel
                                                    showIconWhenClosed
                                                    withIcon
                                                    shadow="box-shadow: 0px 12px 50px 0px #00000033"
                                                    value={value}
                                                    showData
                                                    hideValue={false}
                                                    dropDownHeight={146}
                                                    onOptionSubmit={(value) => setValue(value)}
                                                    valueClassName="caption_regular"
                                                    dropdownClassName="!ml-0 !bg-white w-[468px]"
                                                    optionsClassName="border-l-2 border-l-neutrals-low"
                                                    dropdownProps={{
                                                        left: '3%'
                                                    }}
                                                />
                                            </div>
                                            {leadData?.notes?.[0]?.body &&
                                                <div className="flex flex-col">
                                                    <span className="font-normal text-xs text-neutrals-medium">
                                                        Sales Consultant Note
                                                    </span>
                                                    <span className="text-xs font-semibold text-neutrals-high">
                                                        {leadData?.notes?.[0]?.body}
                                                    </span>
                                                </div>
                                            }

                                            <div className="min-h-20 p-2 border-[1px] border-neutrals-low bg-neutrals-background-default">
                                                <Textarea
                                                    variant="unstyled"
                                                    placeholder="Type your notes here ..."
                                                    className="h-full body_small_regular text-neutrals-medium"
                                                    classNames={{
                                                        input: 'text-neutrals-medium text-xs font-normal'
                                                    }}
                                                    onChange={(e) => setNoteText(e.currentTarget.value)}
                                                    value={noteText ?? ''}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex w-full overflow-y-hidden z-8000">
                                            <Button className="w-1/2 h-[72px] !bg-neutrals-high rounded-none font-medium"
                                                onClick={onClose} >
                                                <p className="text-neutrals-background-default text-base">Cancel</p>
                                            </Button>
                                            <Button
                                                className={`w-1/2 h-[72px] ${value ? '!bg-brand-primary' : '!bg-brand-primary_ext_1'}  rounded-none p-6 font-medium`}
                                                onClick={assignLead}
                                                variant="transparent"
                                                disabled={!value}
                                            >
                                                <p className="text-neutrals-background-default text-base">Assign Lead</p>
                                            </Button>
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
    );
};

export default PopUpWrapper;
