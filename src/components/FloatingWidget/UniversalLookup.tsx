'use client';

import { Dialog, Transition, DialogPanel, TransitionChild } from "@headlessui/react";
import { Fragment, useMemo, useState } from "react";
import './FloatingWidget.module.css';
import { ActionIcon, Combobox, Divider, ScrollArea, TextInput, useCombobox } from "@mantine/core";
import clsx from "clsx";
import Image from "next/image";
import { ISelectItem } from "@/app/types";
import { camelCaseToSentence, splitByHighlight } from "@/utils/common";
import { start } from "repl";

interface UseUniversalLookupProps {
}

interface UniversalLookupProps extends UseUniversalLookupProps {
  isOpen: boolean;
  onClose: () => void;
}

const UniversalLookup: React.FC<UniversalLookupProps> = ({ isOpen, onClose }) => {
  const [value, setValue] = useState('');
  const items: ISelectItem[] = [
    {
      value: "John Nash",
      label: "John Nash",
      data: {
        category: "Prospect",
        phoneNumber: "+82-216-8996-2323",
        salesConsultant: "Baek Hyun"
      }
    },
    {
      value: "John Doe",
      label: "John Doe",
      data: {
        category: "Customer",
        phoneNumber: "+82-216-8996-2323",
        salesConsultant: "Baek Hyun"
      }
    },
    {
      value: "John Smith",
      label: "John Smith",
      data: {
        category: "Order",
        phoneNumber: "+82-216-8996-2323",
        salesConsultant: "Baek Hyun"
      }
    },
    {
      value: "John Smith",
      label: "John Smith",
      data: {
        category: "Vehicle",
        phoneNumber: "+82-216-8996-2323",
        salesConsultant: "Baek Hyun"
      }
    },
  ];
  
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: (eventSource) => {
      if (eventSource === 'keyboard') {
        combobox.selectActiveOption();
      } else {
        combobox.updateSelectedOptionIndex('active');
      }
    },
  });

  const options = useMemo(() => {
    const regex = new RegExp(value, "gi");
    const filtered = (items ?? []).map(i => {
      const matches = [...i.value.matchAll(regex)];

      // Collect match details (matched text and positions)
      const highlights = matches.map(match => ({
        match: match[0], // The matched string
        start: match.index, // Start index of the match
        end: match.index + match[0].length // End index of the match
      }));

      return highlights.length === 0 ? null : {
        ...i, // Keep the original object properties
        data: {
          ...i.data,
          highlights // Add the match details for this object
        }
      };

    }).filter(Boolean) as ISelectItem[];

    const finalItems = (value.length === 0 ? [] : filtered);

    return finalItems.map((item, index) => {
      const highlights = item?.data?.highlights?.[0];
      const { data, value } = item;
      const { match, start, end } = highlights ?? {};
      const { before, highlight, after } = splitByHighlight(value, { start, end });

      return (
        <Combobox.Option
          value={value}
          key={`${value}-${index}`}
        >
          <div className="flex flex-col border-b-[1px] border-b-neutrals-low">
            <div className="flex flex-col gap-y-4 p-2">
              <div className={clsx(
                "flex gap-x-1 w-fit items-center px-1.5 py-[2px] border-[1px] border-neutrals-medium rounded-full",
                data?.category === "Prospect" && "bg-neutrals-background-shading",
                data?.category === "Customer" && "!border-[0.5px] !border-brand-primary bg-indications-bg_success_soft",
                data?.category === "Order" && "border-brand-secondary bg-brand-secondary_ext_2",
                data?.category === "Vehicle" && "bg-indications-neutral_soft border-indications-neutral",
              )}>
                <span className={clsx(
                  "rounded-full size-1.5 border-[1px] text-neutrals-high",
                  data?.category === "Prospect" && "bg-neutrals-medium",
                  data?.category === "Customer" && "bg-brand-primary",
                  data?.category === "Order" && "bg-brand-secondary",
                  data?.category === "Vehicle" && "bg-indications-neutral",
                )}/>
                <span className="caption_small_semibold">{data?.category?.toString()?.toUpperCase()}</span>
              </div>
              <div>
                <div>
                  <span className="text-caption_small_semibold text-neutrals-high">{before}</span>
                  <span className="text-caption_small_semibold text-brand-primary">{highlight}</span>
                  <span className="text-caption_small_semibold text-neutrals-high">{after}</span>
                </div>
                {Object.entries(item?.data ?? {}).filter(d => d[0] !== 'category' && d[0] !== 'highlights').map(d => (
                  <div className="caption_small_regular text-neutrals-medium">
                    <span className="text-neutrals-medium">{camelCaseToSentence(d[0])}:</span> <span className="text-neutrals-high">{d[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Combobox.Option>
      );
    });
  }, [items, value]);

  return (
    <Transition show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-opacity-70 backdrop-blur-sm bg-[rgba(0,0,0,0.7)]" />
        </TransitionChild>

        {/* Modal content */}
        <div className="fixed inset-0 flex items-start justify-center p-2 mt-48">
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
                <Combobox
                  store={combobox}
                  withinPortal={false}
                  onOptionSubmit={(val, optionProps) => {
                    setValue(val);
                    combobox.updateSelectedOptionIndex('active');
                  }}
                  classNames={{
                    dropdown: "p-0 rounded-none",
                  }}
                >
                  <Combobox.Target>
                    <div className="relative">
                      {!value.length && <label className="absolute left-10 top-[1.4rem] !text-[#C0C1C0] font-normal text-[20px] leading-[30px]">Search by Customer Name, Order Number, Contract Number or VIN</label>}
                      <TextInput
                        leftSection={<Image src="/icons/search.svg" alt="search" width={24} height={24} />}
                        classNames={{
                          input: 'text-neutrals-background-default caret-brand-secondary h-full bg-shading-shading text-sub_heading_3-semi-bold rounded-none',
                          wrapper: 'w-[900px] h-[76px] border-[3px] border-[#999999] rounded-none',
                        }}
                        variant="unstyled"
                        rightSection={
                          <div className="flex flex-col items-center justify-center w-[52px] h-full">
                            <ActionIcon variant="unstyled" className="bg-shading-shading hover:bg-shading-shading mr-12 size-[52px] rounded-none" onClick={onClose}>
                              <Image src="/icons/universal-cancel.svg" alt="close" width={32} height={32} />
                            </ActionIcon>
                          </div>
                        }
                        id="universal-lookup"
                        key={`universal-lookup`}
                        onChange={(e) => {
                          setValue(e.currentTarget.value);
                        }}
                        value={value}
                        onClick={() => combobox.toggleDropdown()}
                        autoComplete="off"
                      />
                    </div>
                  </Combobox.Target>
            
                  <Combobox.Dropdown className="rounded-none border-none shadow-select-shadow min-w-[12rem]">
                    <Combobox.Options>
                      <ScrollArea.Autosize mah={500} type="auto" scrollbarSize={10} classNames={{ thumb: 'rounded-none' }}>
                        {options}
                      </ScrollArea.Autosize>
                    </Combobox.Options>
                  </Combobox.Dropdown>
                </Combobox>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UniversalLookup;


export const useUniversalLookup = (props: UseUniversalLookupProps) => {  
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = (
    <UniversalLookup isOpen={isOpen} onClose={() => setIsOpen(false)} />
  );
  
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    modalRef,
  };
}