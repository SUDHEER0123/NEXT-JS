import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { AllCommunityModule, ClientSideRowModelModule, ColDef, ICellRendererParams, iconOverrides, ModuleRegistry, RowSelectionModule, themeQuartz, ValueFormatterParams } from 'ag-grid-community'; 
import React, { useEffect, useState } from 'react';
import { ActionMenu, IActionMenuItem } from '@/components/ActionMenu/action-menu';
import { useCancelContract } from './cancel-contract';
import { useRecordDeposit } from './record-deposit';
import { useManagePayment } from './manage-payments';
import { useUploadInvoice } from './upload-invoice';
import { useContractOverview } from './contract-overview';
import groupBy from 'lodash-es/groupBy';
import clsx from 'clsx';
import { Dictionary } from 'lodash';
import './common.css'
import { IContact, IContract, IFilters, IVehicle } from '@/app/types';
import { useManageContracts } from './manage-contracts';
import { CONTRACT_STATUSES, formatNumberWithCommas } from '@/utils/common';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatDate } from '@/utils/dateFormatter';
import { useAppDataStore } from '@/app/app.store';
import _flatten from 'lodash-es/flatten';

export interface IContractsAndPaymentsTable {
  contracts: IContract[];
}

ModuleRegistry.registerModules([
  AllCommunityModule,
  RowSelectionModule,
  ClientSideRowModelModule,
]);

const actionMenuItems: IActionMenuItem[] = [
  {
    icon: 'pencil-edit-01',
    icon_alt: 'pencil-edit-02',
    title: 'View Contract',
    modal: 'viewContract'
  },
  {
    icon: 'contracts',
    icon_alt: 'contracts',
    title: 'Manage Contracts',
    modal: 'replaceContractDocument'
  },
  {
    icon: 'money-03',
    icon_alt: 'money-03',
    title: 'Manage Payments',
    modal: 'managePayments'
  },
  {
    icon: 'invoice-03',
    icon_alt: 'invoice-04',
    title: 'Manage Customer Invoice',
    modal: 'manageCustomerInvoice'
  },
  {
    icon: 'file-remove',
    icon_alt: 'file-remove',
    title: 'Cancel Contract',
    modal: 'cancelContract',
    style: {
      color: 'red'
    }
  }
];



export const ContractsAndPaymentsTable: React.FC<IContractsAndPaymentsTable> = ({
  contracts
}) => {
  const [groupActive, setGroupActive] = useState('all');
  const [groupedData, setGroupedData] = useState<Dictionary<IContract[]>>({});
  const [contract, setContract] = useState<IContract>();

  const gridRef = React.createRef<AgGridReact<IContract>>();

  const { open: openViewContract, modalRef: viewContractRef } = useContractOverview({ contract });
  const { open: openManagePayments, drawerRef: managePaymentsRef } = useManagePayment({ contract });
  const { open: openManageContracts, drawerRef: manageContractsRef } = useManageContracts({ contract });
  const { open: openUploadInvoice, drawerRef: uploadInvoiceRef } = useUploadInvoice({ contract });
  const { open: openCancelContract, modalRef: cancelContractRef } = useCancelContract({ contract });

  const { modelTypes } = useAppDataStore();

  const [rowData, setRowData] = useState<IContract[]>([]);

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
    checkboxCheckedBackgroundColor: '#00665E',
    checkboxCheckedBorderColor: '#161A11',
  });

  const groupValues = [{
    label: 'All',
    value: 'all',
  },{
    label: 'Model Line',
    value: 'modelLine',
  },{
    label: 'Contract Status',
    value: 'status',
  },{
    label: 'Sales Consultant',
    value: 'salesConsultant'
  }];

  // Column Definitions: Defines the columns to be displayed.
  const colDefs: ColDef[] = [
    { field: "contractNumber", headerName: 'Contract Number', sortable: true, width: 140, flex: 1 },
    {
      field: "createdDate",
      headerName: 'Contract Date',
      sortable: true, 
      width: 140,
      flex: 1,
      valueFormatter: (params: ValueFormatterParams) => {
        return `${formatDate(params?.value)}`;
      }
    },
    {
      field: "modelLine",
      headerName: 'Model Line',
      sortable: true,
      width: 140,
      flex: 1
    },
    {
      field: "customerName",
      headerName: 'Customer Name',
      sortable: true,
      width: 140,
      flex: 1
    },
    {
      field: "vin",
      headerName: 'VIN',
      sortable: true,
      width: 140,
      flex: 1
    },
    {
      field: "value",
      headerName: 'Contract Value',
      sortable: true,
      width: 140,
      valueFormatter: (params) => `${formatNumberWithCommas(params.value)}`
    },
    {
      field: "balance",
      headerName: 'Open Balance',
      sortable: true,
      width: 140,
      valueFormatter: (params) => `${formatNumberWithCommas(params.value?.toLocaleString())}`
    },
    {
      field: "status",
      headerName: 'Contract Status',
      sortable: true,
      width: 140,
    },
    {
      field: "action",
      headerName: "",
      width: 60,
      sortable: false,
      resizable: false,
      cellRenderer: (params: ICellRendererParams) => {
        return (
          <ActionMenu
            actionMenuItems={actionMenuItems}
            onOptionSubmit={(option) => {
              setContract(params.data);
              if(option === 'View Contract') {
                openViewContract();
              }
              else if (option === 'Manage Contracts') {
                openManageContracts();
              }
              else if (option === 'Manage Payments') {
                openManagePayments();
              }
              else if (option === 'Manage Customer Invoice') {
                openUploadInvoice();
              } 
              else if (option === 'Cancel Contract') {
                openCancelContract();
              }
            }}
          />
        )
      }
    }
  ];

  useEffect(() => {
    if(groupActive === 'all') return;

    // Groupby but filter null values
    const filteredData = rowData.filter(d => d[groupActive as keyof IContract] !== null && d[groupActive as keyof IContract] !== undefined && d[groupActive as keyof IContract] !== '');
    const groupedData = groupBy(filteredData, groupActive);

    if(groupActive === 'status') {
      setGroupedData(CONTRACT_STATUSES.map((status) => {
        const data = groupedData[status];

        if(!data) return;

        return {
          [status]: data
        }
      }).filter(Boolean) as unknown as Dictionary<IContract[]>);
    }

  
    setGroupedData(groupedData);
  },[groupActive, rowData]);

  useEffect(() => {
    setRowData(contracts);
  },[contracts]);

  return (
    <div className='flex flex-col pb-4'>
      {viewContractRef}
      {managePaymentsRef}
      {manageContractsRef}
      {uploadInvoiceRef}
      {cancelContractRef}
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
              key={label}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className='flex flex-col gap-y-4 bg-white'>
        {groupActive !== 'all' ? (
          Object.entries(groupedData).map((d, idx) => (
            <>
              <div key={idx}>
                <div className='flex px-8 text-neutrals-high body_small_bold bg-white'>
                  <div className='flex gap-x-2 border-t-[3px] border-t-neutrals-medium px-4 py-3 bg-neutrals-background-surface'>
                    <span className='flex gap-x-2 items-center'>{d[0]}</span>
                    <span className='text-center text-neutrals-default bg-neutrals-low body_small_regular w-[25px] h-[20px]'>{d?.[1]?.length ?? 0}</span>
                  </div>
                </div>
                <div
                  // define a height because the Data Grid will fill the size of the parent container
                  style={{ width: '100%', height: `${34 * (d?.[1]?.length + 1) + 10}px` }}
                >
                  <AgGridReact
                    key={d[0]}
                    rowData={d[1]}
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
                  />
                </div>
              </div>
            </>
          ))
        ):(
          <div
            // define a height because the Data Grid will fill the size of the parent container
            style={{ width: '100%', height: '100%' }}
          >
            <AgGridReact<IContract>
              ref={gridRef}
              rowData={rowData}
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