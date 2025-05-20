'use client';

import { useAppDataStore } from '@/app/app.store';
import { IFilters, ISelectItem, IVehicle, Vehicle } from '@/app/types';
import { SearchFilters } from '@/components/SearchFilters/SearchFilters';
import { TxtInput } from '@/components/ui/TxtInput/text-input';
import api from '@/lib/api';
import { formatNumberWithCommas } from '@/utils/common';
import { formatDate } from '@/utils/dateFormatter';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { ActionIcon, Button, Chip, ComboboxOptionProps, Divider } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import Image from 'next/image';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useAddInventoryVehicle } from './components/add-inventory-vehicle';
import { FiltersActive } from './components/filters';
import { useReserveVehicle } from './components/reserve-vehicle';
import { GoDotFill } from 'react-icons/go';
import { Loader } from '@/components/ui/Loader/Loader';

interface UseStockInventoryProps {}

export interface IStockInventory extends Vehicle {
  images: string[];
  title: string;
  description: string;
  power: number;
  mph: number;
  topSpeed: number;
  vin: string;
  year: string;
  odometer: number;
  exteriorColor: string;
  interiorColor: string;
  price: number;
  vehiclePrice: number;
  optionPrice: number;
  reserved?: boolean;
  reservedBy?: string;
  reservedDate?: string;
  depositAmt?: number;
  location?: string;
}

interface StockInventoryProps extends UseStockInventoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface IStockListData {
  reservedDate: string | null;
  pdiImageArray: {
    imageUrl: string;
    thumbnailImageUrl: string;
  }[];
  updatedDate: string;
  status: string;
  configuratorCode: string;
  locationUid: string;
  uid: string;
  vehiclePrice: number;
  orderUid: string;
  createdDate: string;
  vesselUrl: string;
  configuratorDocumentUid: string;
  vehicleUid: string;
  reservedProspectUid: string;
  optionPrice: number;
  totalVehiclePrice: number;
  testDriveVehicle: boolean;
  vesselTrackingNumber: string;
  optionDocumentUid: string;
  vesselName: string;
  underQN: string | null;
  vehicleInspectionDocumentUid: string | null;
  finance: {
    interestRate: number;
    uid: string;
    stockUid: string;
    amount: number;
    createdDate: string;
    repaymentDate: string;
    bankName: string;
    updatedDate: string;
  };
  inventoryFinanced: boolean;
  transitType: string | null;
  depositAmt: number;
  heroImage: string;
}

const StockInventory: React.FC<StockInventoryProps> = ({ isOpen, onClose }) => {
  const [activeFilters, setActiveFilters] = useState<IFilters[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [stocks, setStocks] = useState<IStockInventory[]>([]);

  const { modelTypes, locations } = useAppDataStore();

  const {
    data: stockListData,
    isLoading: isLoadingStockListData,
    error: errorStockListData,
  } = useQuery({
    queryKey: ['stocks'],
    queryFn: () => api.get(`/order/stock`).then(res => res.data as IStockListData[]),
  });

  const {
    data: vehicles,
    isLoading: isLoadingVehicles,
    error: errorGettingVehicle,
  } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.get('/vehicle').then(res => res.data as IVehicle[]),
  });

  useEffect(() => {
    if (stockListData?.length && vehicles?.length && modelTypes?.length) {
      setStocks(
        stockListData.map((stock, idx: number) => {
          const vehicle = vehicles.find(v => v.uid === stock.vehicleUid);
          const modelType = modelTypes.find(m => m.uid === vehicle?.modelTypeUid);
          const location = locations?.find(l => l.uid === stock.locationUid);

          return {
            id: `${idx + 1}`,
            title: modelType?.displayName || '',
            model: modelType?.type || '',
            description: modelType?.description || '',
            power: modelType?.bhp || 0,
            mph: modelType?.acceleration || 0,
            topSpeed: modelType?.speed || 0,
            images: vehicle?.images?.map((image: any) => image.imageUrl) || [],
            vin: vehicle?.vin || '',
            year: vehicle?.year?.toString() || '',
            odometer: vehicle?.odometer || 0,
            exteriorColor: vehicle?.extColor?.color || '',
            interiorColor: vehicle?.intColor?.color || '',
            price: stock.totalVehiclePrice,
            vehiclePrice: stock.vehiclePrice,
            optionPrice: stock.optionPrice,
            reserved: stock.status === 'Allocated',
            reservedBy: stock.reservedProspectUid,
            reservedDate: stock.reservedDate?.toString() || '',
            depositAmt: stock.depositAmt,
            vehicleStatus: stock.status,
            vehicleImage: stock.heroImage,
            location: location?.name || '',
          };
        })
      );
    } else {
      setStocks([]);
    }
  }, [stockListData, vehicles, modelTypes]);

  const { open: addInventoryVehicle, drawerRef: addInventoryVehicleRef } = useAddInventoryVehicle({});
  const [vehicleToReserve, setVehicleToReserve] = useState<IStockInventory>();
  const { open: openReserveVehicle, drawerRef: reserveVehicleRef } = useReserveVehicle({
    vehicle: vehicleToReserve,
    onReserve: (vehicleId: string, reservedBy: string, reservationDate: string, depositAmt: number) => {
      setStocks(curr => {
        return [
          ...curr.filter(c => c.id !== vehicleId),
          {
            ...curr.find(c => c.id === vehicleId),
            reserved: true,
            reservedBy,
            reservedDate: reservationDate,
            depositAmt,
          } as IStockInventory,
        ];
      });
    },
    onClose: () => {
      setVehicleToReserve(undefined);
    },
  });

  const modelTypesOptions = useMemo(() => {
    return Array.from(
      new Set(
        modelTypes?.map(modelType => ({
          value: modelType.uid,
          label: modelType.displayName,
        }))
      )
    );
  }, [modelTypes]);

  const updateActiveFilters = (filter: IFilters, val: ISelectItem, optionProps: ComboboxOptionProps, isMultiSelect = true) => {
    const existingValues = activeFilters.find(activeFilter => activeFilter.value === filter.value)?.options || [];
    const newActiveFilter = {
      label: filter.label,
      value: filter.value,
      options: !isMultiSelect
        ? [val]
        : ([...existingValues.filter(e => e.value !== val?.value), existingValues.find(e => e.value === val?.value) ? null : val?.value].filter(Boolean) as ISelectItem[]),
    };

    setActiveFilters(current => {
      const otherActiveFilters = current.filter(f => f.value !== filter.value);

      // If the new active filter has no options, remove it from the active filters
      if (newActiveFilter.options.length === 0) {
        return otherActiveFilters;
      }
      // Otherwise, add the new active filter to the list
      // and return the updated list

      return [...otherActiveFilters, newActiveFilter];
    });
  };

  const searchFilters: IFilters[] = [
    { label: 'Model Type', value: 'model', options: modelTypesOptions, isMultiSelect: true },
    {
      label: 'Exterior Color',
      value: 'orderDate',
      options: ['Black', 'White', 'Yellow', 'Green'].map(d => ({ value: d, label: d })),
      isMultiSelect: true,
    },
    {
      label: 'Interior Color',
      value: 'dealerLocation',
      options: ['Black', 'White', 'Yellow', 'Green'].map(d => ({ value: d, label: d })),
      isMultiSelect: true,
    },
  ];

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const filteredStocks = useMemo(() => {
    if (!searchValue) return stocks;
    return stocks.filter(stock => {
      return stock?.model?.toLowerCase().includes(searchValue?.toLowerCase()) || stock?.vin?.toLowerCase().includes(searchValue?.toLowerCase());
    });
  }, [searchValue, stocks]);

  useEffect(() => {
    if (!vehicleToReserve) return;

    openReserveVehicle();
  }, [vehicleToReserve]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Background overlay */}
        <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0" />
        </TransitionChild>

        {/* Modal content */}
        <div className="fixed inset-0 flex items-center justify-center p-2 backdrop-blur-sm bg-[rgba(0,0,0,0.3)]">
          <div className="flex flex-row">
            {reserveVehicleRef}
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
                  <div className="flex flex-col xl:w-[70vw] xl:h-[50vw] 2xl:w[70vw] 2xl:h-[41.67vw] max-h-[90vh]">
                    {addInventoryVehicleRef}
                    <div className="flex flex-col border bg-[#E7E9E2] items-center text-center gap-y-6 py-6">
                      <p className="headings_2_semibold">Explore Our Stock Vehicles</p>
                      <div className="flex flex-row gap-x-2 items-center h-[44px]">
                        <TxtInput
                          placeholder="Search by Model Line or VIN"
                          className={clsx('bg-neutrals-background-default border border-neutrals-low text-neutrals-medium h-[44px] w-[500px]')}
                          inputClassName="!h-[44px]"
                          leftSection={<Image src="/icons/search-black.svg" alt="search" width={24} height={24} />}
                          hideLabel
                          onChange={e => handleSearch(e.currentTarget.value)}
                        />
                        <Button
                          className="bg-brand-primary text-neutrals-background-default rounded-none hover:bg-brand-primary h-full"
                          leftSection={<Image src="/icons/add-01-secondary.svg" width={20} height={20} alt="add" />}
                          onClick={() => addInventoryVehicle()}
                        >
                          <p>Vehicle</p>
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col bg-white w-full h-full overflow-y-hidden">
                      <div className="flex caption_semibold justify-between h-[44px]">
                        <div className="flex gap-x-1 p-6">
                          <span className="text-neutrals-high">{filteredStocks?.length}</span>
                          <span className="text-neutrals-medium">VEHICLES</span>
                        </div>
                        <div className="py-2 px-6">
                          <SearchFilters filters={searchFilters} activeFilters={activeFilters} updateActiveFilters={updateActiveFilters} />
                        </div>
                      </div>

                      <div className="px-5 py-2">
                        {activeFilters.length > 0 && (
                          <div>
                            <FiltersActive
                              activeFilters={activeFilters}
                              onReset={() => {
                                setActiveFilters([]);
                              }}
                              onFilterRemove={(value, filter) => {
                                setActiveFilters(curr => {
                                  const filterData = curr?.find(a => a.value === value);

                                  return [
                                    ...curr.filter(c => c.value !== value),
                                    filterData &&
                                      ({
                                        ...(filterData ?? {}),
                                        options: filterData?.options?.filter(f => f?.value !== filter) ?? [],
                                      } as IFilters),
                                  ] as IFilters[];
                                });
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {isLoadingStockListData || isLoadingVehicles ? (
                        <div className="flex items-center justify-center h-screen">
                          <Loader />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-y-3 px-6 pb-2 overflow-y-auto items-center w-full">
                          {filteredStocks?.map(stock => (
                            <div key={stock.id} className="flex gap-x-1 items-center relative w-full">
                              {/** Stock Image */}
                              <div className="flex flex-col gap-y-1 h-full w-full max-w-max min-w-[230px] flex-shrink-0">
                                <Image className="object-cover h-full" src={stock.images[0]} width={230} height={228} alt="stock-car" />

                                <div className="flex gap-x-1 w-full">
                                  {stock.images.slice(1, 4).map((image, index) => {
                                    return <Image key={index} src={image} width={74} height={40} alt={`${image}`} />;
                                  })}
                                </div>
                              </div>

                              {/** Stock Details */}
                              <div className="bg-neutrals-background-default border-[1px] border-neutrals-low px-2 w-full h-full">
                                <div className="flex flex-col py-2 pr-4">
                                  <div className="flex justify-between">
                                    <div className="flex flex-col">
                                      <span className="sub_heading_3_semibold">{stock.model}</span>
                                      <span className="flex gap-1 my-1">
                                        <Image src="/icons/location-03.svg" width={12} height={12} alt="location" />{' '}
                                        <span className=" caption_small_regular text-neutrals-medium"> {stock.location}</span>
                                      </span>
                                    </div>
                                    {stock.vehicleStatus && (
                                      <div>
                                        <Chip icon={<GoDotFill size={16} />} variant="light" color="gray" checked>
                                          <span className="caption_semibold text-neutrals-high">{stock.vehicleStatus}</span>
                                        </Chip>
                                      </div>
                                    )}
                                    <div className="flex gap-x-8">
                                      <div className="flex flex-col">
                                        <p className="caption_semibold text-neutrals-high">{stock.power}</p>
                                        <div className="flex gap-x-1">
                                          <span className="caption_small_semibold text-neutrals-high">Power</span>
                                          <span className="caption_small_regular text-neutrals-medium">PS</span>
                                        </div>
                                      </div>

                                      <div className="flex flex-col">
                                        <p className="caption_semibold text-neutrals-high">{stock.mph}</p>
                                        <div className="flex gap-x-1">
                                          <span className="caption_small_semibold text-neutrals-high">0-62 MPH</span>
                                          <span className="caption_small_regular text-neutrals-medium">S</span>
                                        </div>
                                      </div>

                                      <div className="flex flex-col">
                                        <p className="caption_semibold text-neutrals-high">{stock.topSpeed}</p>
                                        <div className="flex gap-x-1">
                                          <span className="caption_small_semibold text-neutrals-high">Top Speed</span>
                                          <span className="caption_small_regular text-neutrals-medium">MPH</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <p className="caption_regular text-neutrals-high text-wrap whitespace-pre-wrap break-words block">{stock.description}</p>

                                <div className="flex gap-x-6 pb-2 pt-3">
                                  <div className="flex gap-x-6 pt-2">
                                    <div className="flex flex-col caption_small_regular text-neutrals-high">
                                      <span>VIN:</span>
                                      <span>Year:</span>
                                      <span>Odometer:</span>
                                    </div>

                                    <div className="flex flex-col caption_small_regular text-neutrals-medium">
                                      <span>{stock.vin || <span>&nbsp;</span>}</span>
                                      <span>{stock.year || <span>&nbsp;</span>}</span>
                                      <span>{stock.odometer || <span>&nbsp;</span>}</span>
                                    </div>
                                  </div>

                                  <div className="flex flex-row gap-x-6 pt-2">
                                    <div className="flex flex-col caption_small_regular text-neutrals-high">
                                      <span>Exterior Color:</span>
                                      <span>Interior Color:</span>
                                    </div>

                                    <div className="flex flex-col caption_small_regular text-neutrals-medium">
                                      <span>{stock.exteriorColor || <span>&nbsp;</span>}</span>
                                      <span>{stock.interiorColor || <span>&nbsp;</span>}</span>
                                    </div>
                                  </div>
                                </div>
                                <Divider className="mb-6" />
                                <div className="flex flex-col gap-y-4">
                                  <div className="flex items-center">
                                    <div>
                                      <div>
                                        <span className="caption_small_regular text-neutrals-high">Vehicle Cost:</span>
                                        <span className="caption_small_regular text-neutrals-medium">{formatNumberWithCommas(stock.vehiclePrice)}</span>
                                      </div>
                                      <div>
                                        <span className="caption_small_regular text-neutrals-high">Option Cost:</span>
                                        <span className="caption_small_regular text-neutrals-medium">{formatNumberWithCommas(stock.optionPrice)}</span>
                                      </div>
                                    </div>
                                    <Divider className="mx-2" orientation="vertical" />
                                    <div className="flex flex-col">
                                      <span className="caption_small_regular text-neutrals-medium">Total Vehicle Cost:</span>
                                      <span className="font-medium">{formatNumberWithCommas(stock.price)}</span>
                                    </div>
                                  </div>

                                  <div className="flex gap-x-2 mb-2">
                                    <Button className="bg-neutrals-background-default border-[1px] border-neutrals-low hover:bg-neutrals-background-default hover:text-neutrals-high text-neutrals-high w-fit h-[38px] rounded-none">
                                      <p className="caption_semibold">Issue Sales Contract</p>
                                    </Button>

                                    {!stock.reserved && (
                                      <Button
                                        className="bg-brand-primary hover:bg-brand-primary hover:text-neutrals-background-default text-neutrals-background-default w-fit h-[38px] rounded-none"
                                        onClick={() => {
                                          setVehicleToReserve(stock);
                                        }}
                                      >
                                        <p className="caption_semibold">Reserve Vehicle</p>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Reserved By */}
                              {stock.reserved && (
                                <div className="flex flex-col px-3 py-2 absolute bottom-0 right-0 bg-neutrals-high max-w-max">
                                  <div className="relative pb-3">
                                    <span className="text-neutrals-low caption_small_regular">ORDER ALLOCATION</span>
                                    <Image src="/images/reserved-card-pattern.svg" width={190} height={79} alt="reserved-card-pattern" className="absolute -top-2 -right-3" />
                                  </div>
                                  <div className="flex gap-x-2 items-center h-full pb-2">
                                    <Image src={`/images/reserved-avatar.svg`} width={25} height={25} alt="reserved-avatar" />
                                    <span className="text-neutrals-background-default body_regular_semibold">{stock.reservedBy}</span>
                                  </div>
                                  <div className="h-[0.5px] bg-neutrals-medium" />
                                  <div className="flex gap-x-24 justify-between pt-2">
                                    <div className="flex gap-x-6">
                                      <div className="flex flex-col">
                                        <span className="text-neutrals-low caption_small_regular">Reservation Date</span>
                                        <span className="text-neutrals-background-default caption_small_regular">{formatDate(stock.reservedDate)}</span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-neutrals-low caption_small_regular">Deposit</span>
                                        <span className="text-neutrals-background-default caption_small_regular">{formatNumberWithCommas(stock.depositAmt)}</span>
                                      </div>
                                    </div>
                                    <div>
                                      <Button
                                        variant="unstyled"
                                        className="bg-transparent hover:bg-transparent border-[1px] border-neutrals-medium rounded-none"
                                        onClick={() => {
                                          setStocks(curr => {
                                            const stockIndex = curr.findIndex(s => s.id === stock.id);

                                            curr[stockIndex].reserved = false;
                                            curr[stockIndex].reservedBy = '';
                                            curr[stockIndex].reservedDate = '';
                                            curr[stockIndex].depositAmt = 0;

                                            return [...curr];
                                          });
                                        }}
                                      >
                                        <p className="caption_small_semibold text-neutrals-background-default">Cancel Reservation</p>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          {filteredStocks?.length === 0 && (
                            <div className="flex flex-col items-center justify-center self-center mt-48">
                              <Image src="/images/car-search.svg" width={56} height={56} alt="car-search" />
                              <p className="body_large_regular text-neutrals-high">We couldn't find ‘{searchValue}‘</p>
                            </div>
                          )}
                        </div>
                      )}
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

export default StockInventory;

export const useStockInventory = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = <StockInventory isOpen={isOpen} onClose={() => setIsOpen(false)} />;

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    modalRef,
  };
};
