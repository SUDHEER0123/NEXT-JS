import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { AllCommunityModule, ClientSideRowModelModule, ColDef, ICellRendererParams, ModuleRegistry, RowSelectionModule, themeQuartz, iconOverrides, IRowNode, ValueFormatterParams } from 'ag-grid-community'; 
import React, { useEffect, useMemo, useState } from 'react';
import { useVehicleOverview } from './view-vehicle';
import { useRegisterVehicle } from './register-vehicle';
import { useDeleteVehicle } from './delete-vehicle';
import groupBy from 'lodash-es/groupBy';
import clsx from 'clsx';
import { Dictionary } from 'lodash';
import './common.css';
import { Button } from '@mantine/core';
import Image from 'next/image';
import { ActionMenu, IActionMenuItem } from '@/components/ActionMenu/action-menu';
import { IContact, IVehicle } from '@/app/types';
import { formatDate } from '@/utils/dateFormatter';
import { VEHICLE_STATUSES } from '@/utils/common';
export interface IVehiclesTable {
  data: IVehicleTable[];
  contacts?: IContact[];
}

export interface IVehicleTable extends IVehicle {
  modelLine: string;
  dealerLocation: string;
  customerName: string;
}

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
  RowSelectionModule
]);

const actionMenuItems: IActionMenuItem[] = [
  {
    icon: 'car-info',
    icon_alt: 'car-info',
    title: 'View Vehicle',
    modal: 'viewVehicle'
  },
  {
    icon: 'register_car',
    icon_alt: 'register_car',
    title: 'Register Vehicle',
    modal: 'registerVehicle'
  },
  {
    icon: 'delete_car',
    icon_alt: 'delete_car',
    title: 'Delete Vehicle',
    style: {
      color: '#D60100'
    }
  }
];

const groupValues = [{
  label: 'All',
  value: 'all',
},{
  label: 'Model Line',
  value: 'modelLine',
},{
  label: 'Dealer Location',
  value: 'dealerLocation',
},{
  label: 'Vehicle Status',
  value: 'status'
}];

export const VehiclesTable: React.FC<IVehiclesTable> = ({ data, contacts }) => {
  const [groupActive, setGroupActive] = useState('all');
  const [groupedData, setGroupedData] = useState<Dictionary<IVehicleTable[]>>({});
  const gridRef = React.createRef<AgGridReact<IVehicleTable>>();
  const [rowsSelected, setRowsSelected] = useState<{ key: string, rowsSelected: IRowNode<IVehicleTable>[] }[]>();
  const [selectedVehicle, setSelectedVehicle] = useState<IVehicleTable>();
  const [selectedOption, setSelectedOption] = useState<string>();
 
  const { open: openViewVehicle, modalRef: viewVehicleRef } = useVehicleOverview({ vehicle: selectedVehicle, contacts });
  const { open: openRegisterVehicle, drawerRef: registerVehicleRef } = useRegisterVehicle({vehicleData:selectedVehicle});
  const { open: openDeleteVehicle, modalRef: deleteVehicleRef } = useDeleteVehicle({});

  const fontAwesomeIcons = iconOverrides({
    type: 'image',
    mask: true,
    icons: {
      // map of icon names to images
      'asc': { url: '/icons/sort-asc.svg' },
      'desc': { url: '/icons/sort-desc.svg' },
      'none': { url: '/icons/sort-none.svg' },
    }
  });

  const myTheme = themeQuartz.withPart(fontAwesomeIcons).withParams({
    wrapperBorder: true,
    headerRowBorder: true,
    rowBorder: { style: 'solid', color: '#E5E5E3' },
    columnBorder: { style: 'solid', color: '#E5E5E3 ' },
    checkboxUncheckedBorderColor: '#161A11',
    checkboxCheckedBackgroundColor: '#161A11',
    checkboxCheckedBorderColor: '#161A11',
  });

  // Column Definitions: Defines the columns to be displayed.
  const colDefs: ColDef[] = useMemo(() => [
    { field: "vinNumber", headerName: 'VIN', sortable: true, width: 180, flex: 1 },
    { field: "status", headerName: 'Vehicle Status', sortable: true, width: 130, flex: 1 },
    {
      field: "modelName",
      headerName: 'Model Type',
      sortable: true,
      width: 180,
      flex: 1
    },
    {
      field: "dealerLocation",
      headerName: 'Dealer Location',
      sortable: true,
      width: 150,
      flex: 1
    },
    {
      field: "customerName",
      headerName: 'Customer Name',
      sortable: true,
      width: 130,
      flex: 1
    },
    {
      field: "registrationDate",
      headerName: 'Registration Date',
      sortable: true,
      width: 150,
      flex: 1,
      valueFormatter: (params: ValueFormatterParams) => {
        return formatDate(params?.data?.registrationDate);
      }
    },
    { field: "year", headerName: 'Year', sortable: true, maxWidth: 100, width: 130, flex: 1 },
    {
      field: "extColor.color",
      headerName: 'Color',
      sortable: true,
      minWidth: 100,
      flex: 1
    },
    {
      field: "action",
      headerName: "",
      sortable: false,
      resizable: false,
      width: 60,
      cellRenderer: (params: ICellRendererParams) => {
        return (
          <ActionMenu
            actionMenuItems={actionMenuItems}
            onOptionSubmit={(option) => {
              setSelectedOption(option);
              setSelectedVehicle(params?.data);
            }}
          />
        )
      }
    }
  ],[]);

  useEffect(() => {
    if(groupActive === 'all') return;

    // Groupby but filter null values
    const filteredData = data.filter(d => d[groupActive as keyof IVehicleTable] !== null && d[groupActive as keyof IVehicleTable] !== undefined && d[groupActive as keyof IVehicleTable] !== '');
    const groupedData = groupBy(filteredData, groupActive);

    setGroupedData(groupedData);
  },[groupActive, data]);

  useEffect(() => {
    if(!selectedVehicle || !selectedOption) return;

    if(selectedOption === 'View Vehicle') {
      openViewVehicle();
    }
    else if (selectedOption === 'Register Vehicle') {
      openRegisterVehicle();
    }
    else if (selectedOption === 'Delete Vehicle') {
      openDeleteVehicle();
    }

    setSelectedOption(undefined);
  },[selectedVehicle, selectedOption]);

  const displayTable = (key: string, value: IVehicleTable[]) => {
    const data = value;
    const rowsData = (rowsSelected?.find(r => r.key === key)?.rowsSelected ?? []);

    return (
      <div key={key}>
        <div className='flex gap-x-2 px-8 text-neutrals-high body_small_bold bg-white'>
          <div className='flex gap-x-2 border-t-[3px] border-t-neutrals-medium px-4 py-3 bg-neutrals-background-surface'>
            <span className='flex gap-x-2 items-center'>{key}</span>
            <span className='text-center text-neutrals-default bg-neutrals-low body_small_regular w-[25px] h-[20px]'>{value.length ?? 0}</span>
          </div>
          {rowsData.length >= 2 && (
            <div className='flex items-center gap-x-3 px-2 py-1 text-neutrals-high gap-x-2 bg-indications-bg_warning_soft border-[0.5px] border-indications-warning h-[40px] mt-1'>
              <div className='flex gap-x-3'>
                <div className='flex gap-x-1'>
                  <span className='body_small_bold'>{rowsData?.length}</span>
                  <span className='body_small_regular'>selected.</span>
                </div>
                <span className='body_small_regular underline decoration-neutrals-high underline-offset-4 cursor-pointer'>Clear</span>
              </div>
              <div className='flex gap-x-1'>
                <Button
                  className='bg-neutrals-background-default text-neutrals-high caption_regular hover:bg-neutrals-background-default hover:text-neutrals-high !py-1.5 !px-2.5 border-[1px] border-neutrals-low rounded-none h-[30px]'
                  onClick={() => {}}
                  variant='unstyled'
                  leftSection={
                    <Image src="/icons/file-sync-black.svg" width={16} height={16} alt="change-status" />
                  }
                >
                  <p>Change Status</p>
                </Button>
                <Button
                  className='bg-neutrals-background-default text-neutrals-high caption_regular hover:bg-neutrals-background-default hover:text-neutrals-high !py-1.5 !px-2.5 border-[1px] border-neutrals-low rounded-none h-[30px]'
                  onClick={() => {}}
                  variant='unstyled'
                  leftSection={
                    <Image src="/icons/location-03-black.svg" width={16} height={16} alt="change-status" />
                  }
                >
                  <p>Change Location</p>
                </Button>
                <Button
                  className='bg-neutrals-background-default text-neutrals-high caption_regular hover:bg-neutrals-background-default hover:text-neutrals-high !py-1.5 !px-2.5 border-[1px] border-neutrals-low rounded-none h-[30px]'
                  onClick={() => {}}
                  variant='unstyled'
                  leftSection={
                    <Image src="/icons/file-export.svg" width={16} height={16} alt="change-status" />
                  }
                >
                  <p>Export</p>
                </Button>
              </div>
            </div>
          )}
        </div>
        <div
          // define a height because the Data Grid will fill the size of the parent container
          style={{ width: '100%', height: `${34 * ((data ?? []).length + 1) + 10}px` }}
          key={key}
        >
          <AgGridReact
            key={key}
            rowData={data}
            columnDefs={colDefs as any}
            rowHeight={34}
            theme={myTheme}
            headerHeight={36}
            rowSelection= {{ mode: "multiRow", headerCheckbox: true }}
            defaultColDef={{
              unSortIcon: true,
            }}
            suppressRowHoverHighlight={true}
            enableCellTextSelection={true}
            suppressCellFocus={true}
            onRowSelected={(event) => {
              if(!event.node.isSelected()) {
                setRowsSelected((current) => {
                  const rowData = current?.find((r) => r.key === key);
                  return [
                    ...(current ?? [])?.filter((r) => r.key !== key),
                    {
                      key: key ?? '',
                      rowsSelected: rowData?.rowsSelected.filter((r) => r.rowIndex !== event.rowIndex).filter(Boolean) as IRowNode<IVehicleTable>[] ?? []
                    }
                  ];
                });
                return;
              }

              const isExisting = rowsSelected?.find((r) => r.key === key);

              if(!isExisting) {
                setRowsSelected((current) => {
                  return [
                    ...(current ?? []),
                    {
                      key: key ?? '',
                      rowsSelected: event.node ? [event.node] : []
                    }
                  ];
                });
              } else {
                setRowsSelected((current) => {
                  const rowData = current?.find((r) => r.key === key);
                  return [
                    ...(current ?? [])?.filter((r) => r.key !== key),
                    {
                      key: key ?? '',
                      rowsSelected: event.node ? [...rowData?.rowsSelected.map(d => d) as IRowNode<IVehicleTable>[], event.node] : []
                    }
                  ];
                });
              }
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-col pb-4'>
      {viewVehicleRef}
      {registerVehicleRef}
      {deleteVehicleRef}
      
      <div className="flex gap-x-4 items-center pl-8 pb-4">
        <span className="body_small_semibold">Grouped by:</span>
        <div className="flex border border-neutrals-low border-r-transparent">
          {groupValues.map(({ label, value }) => (
            <span
              className={clsx(
                'text-neutrals-high caption_regular border-r py-2 px-4 cursor-pointer',
                groupActive === value && 'bg-neutrals-high text-white'
              )}
              onClick={() => setGroupActive(value)}
              key={value}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className='flex flex-col gap-y-4 bg-white'>
        {groupActive !== 'all' ? (
          groupActive === 'status' ? (
            VEHICLE_STATUSES.map((status) => {
              // only show the status if there is data
              if(!groupedData[status]) return null;
              
              // if there is no data, return null
              if(groupedData[status].length === 0) return null;

              return displayTable(status, groupedData[status] ?? []);
            }
          )):(
            Object.entries(groupedData).map(d => displayTable(d[0], d[1]))
          )
        ):(
          <div
            // define a height because the Data Grid will fill the size of the parent container
            style={{ width: '100%', height: '100%' }}
          >
            <AgGridReact<IVehicleTable>
              ref={gridRef}
              rowData={data}
              columnDefs={colDefs as any}
              rowHeight={34}
              theme={myTheme}
              headerHeight={36}
              rowSelection= {{ mode: "multiRow", headerCheckbox: true }}
              domLayout='autoHeight'
              defaultColDef={{
                unSortIcon: true,
              }}
              suppressRowHoverHighlight={true}
              enableCellTextSelection={true}
              suppressCellFocus={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}