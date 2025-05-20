import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { AllCommunityModule, ClientSideRowModelModule, ColDef, ICellRendererParams, ModuleRegistry, RowSelectionModule, themeQuartz, iconOverrides, IRowNode, ValueFormatterParams } from 'ag-grid-community'; 
import React, { useEffect, useState } from 'react';
import { ActionMenu, IActionMenuItem } from '@/components/ActionMenu/action-menu';
import groupBy from 'lodash-es/groupBy';
import { Dictionary } from 'lodash';
import './common.css';
import { Button } from '@mantine/core';
import Image from 'next/image';
import { IContract, IOrderView } from '@/app/types';
import { useOrderOverview } from './order-overview';
import { useRecordDeposit } from './record-deposit';
import { useRecordPayment } from './record-payment';
import { useUploadInvoice } from './upload-invoice';
import { useVehicleStatus } from './vehicle-status';
import { useCancelOrder } from './cancel-order';
import { useManageContracts } from './manage-contracts';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatDate } from '@/utils/dateFormatter';
import { useOrdersStore } from '../store/orders.store';
import { formatNumberWithCommas, ORDER_STATUSES, VEHICLE_STATUSES } from '@/utils/common';

export interface IOrdersTable {
  data: IOrderView[];
  groupActive: string;
}

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
  RowSelectionModule
]);
interface TableData {
  orderNumber: string;
  orderDate: string;
  modelLine: string;
  customerName: string;
  orderStatus: string;
  vehicleStatus: string;
  contractNo: string;
  contractValue: string;
};

const actionMenuItems: IActionMenuItem[] = [
  {
    icon: 'pencil-edit-01',
    icon_alt: 'pencil-edit-02',
    title: 'View Order',
    hidden: ['Stock Order'],
    modal: 'viewOrder'
  },
  {
    icon: 'money-add-02',
    icon_alt: 'money-add-03',
    title: 'Record Deposit',
    hidden: ['Stock Order'],
    modal: 'recordDeposit'
  },
  {
    icon: 'money-receive-02',
    icon_alt: 'money-receive-03',
    title: 'Record Payment',
    hidden: ['Stock Order'],
  },
  {
    icon: 'contracts',
    icon_alt: 'contracts-02',
    title: 'Manage Contracts',
    hidden: ['Stock Order'],
  },
  {
    icon: 'invoice-03',
    icon_alt: 'invoice-04',
    title: 'Manage Customer Invoice',
    hidden: ['Stock Order']
  },
  {
    icon: 'car-update',
    icon_alt: 'car-update-02',
    title: 'Update Order Tracker'
  },
  {
    icon: 'file-remove',
    icon_alt: 'file-remove',
    title: 'Cancel Order',
    style: {
      color: '#D60100'
    }
  }
];

export const OrdersTable: React.FC<IOrdersTable> = (props) => {
  const [groupedData, setGroupedData] = useState<Dictionary<IOrderView[]>>({});
  const gridRef = React.createRef<AgGridReact<IOrderView>>();
  const [rowsSelected, setRowsSelected] = useState<{ key: string, rowsSelected: IRowNode<IOrderView>[] }[]>();
  const [rowData, setRowData] = useState<IOrderView[]>(props.data);
  const groupActions = false;
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
  const { selectedOrder, setSelectedOrder } = useOrdersStore();
  const [option, setOption] = useState<string | null>(null);

  const contractUid = selectedOrder?.contractuid;

  const { data: contract, isLoading: isLoadingContract, error: errorGettingContract } = useQuery({
    queryKey: ['contract', contractUid],
    queryFn: () => api.get(`/contract/${contractUid}`).then(res => res.data as IContract),
    enabled: !!contractUid,
  });

  const { open: openViewOrder, modalRef: viewOrderRef } = useOrderOverview({ orderView: selectedOrder });
  const { open: openRecordDeposit, drawerRef: recordDepositRef } = useRecordDeposit({ order: selectedOrder });
  const { open: openRecordPayment, drawerRef: recordPaymentRef } = useRecordPayment({ order: selectedOrder });
  const { open: openUploadContract, drawerRef: uploadContractRef } = useManageContracts({ contract, onClose: () => {} });
  const { open: openUploadInvoice, drawerRef: uploadInvoiceRef } = useUploadInvoice();
  const { open: openVehicleStatus, modalRef: updateVehicleStatusRef } = useVehicleStatus({ order: selectedOrder });
  const { open: openCancelOrder, modalRef: cancelOrderRef } = useCancelOrder({ order: selectedOrder });

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
  const colDefs: ColDef[] = [
    {
      field: "ordernumber",
      headerName: 'Order No',
      sortable: true,
      width: 180,
      flex: 1,
      valueFormatter: (params: ValueFormatterParams) => {
        return params?.data?.orderNumber ?? 'Not assigned';
      }
    },
    {
      field: "placeddate",
      headerName: 'Order Date',
      sortable: true,
      width: 150,
      flex: 1,
      valueFormatter: (params: ValueFormatterParams) => {
        return formatDate(params?.data?.placeddate);
      }
    },
    {
      field: "model",
      headerName: 'Model Line',
      sortable: true,
      width: 150,
      flex: 1
    },
    {
      field: "fullnameen",
      headerName: 'Customer Name',
      sortable: true,
      width: 200,
      flex: 1
    },
    {
      field: "orderstatus",
      headerName: 'Order Status',
      sortable: true,
      width: 150,
      flex: 1
    },
    {
      field: "contractnumber",
      headerName: 'Contract No',
      sortable: true,
      width: 150,
      flex: 1
    },
    {
      field: "contractvalue",
      headerName: 'Contract Value',
      sortable: true,
      width: 150,
      flex: 1,
      valueFormatter: (params: ValueFormatterParams) => {
        return params?.data?.contractvalue ? formatNumberWithCommas(params?.data?.contractvalue) : ''
      }
    },
    {
      field: "action",
      headerName: "",
      sortable: false,
      resizable: false,
      width: 60,
      cellRenderer: (params: ICellRendererParams) => {
        return (
          <div className='mt-1'>
            <ActionMenu
              actionMenuItems={actionMenuItems.filter((item) => !item.hidden?.includes(params.data.type))}
              onOptionSubmit={(option) => {
                setSelectedOrder(params.data);
              }}
            />
          </div>
        )
      }
    }
  ];

  useEffect(() => {
    if(props.groupActive === 'all') return;

    // Groupby but filter null values, undefined values and empty strings
    const filteredData = rowData.filter(d => d[props.groupActive as keyof IOrderView] !== null && d[props.groupActive as keyof IOrderView] !== undefined && d[props.groupActive as keyof IOrderView] !== '');
    const groupedData = groupBy(filteredData, props.groupActive);

    if(props.groupActive === 'vehiclestatus') {
      setGroupedData(VEHICLE_STATUSES.map((status) => {
        const data = groupedData[status];

        if(!data) return;

        return {
          [status]: data
        }
      }).filter(Boolean) as unknown as Dictionary<IOrderView[]>);
    }

    if(props.groupActive === 'orderstatus') {
      setGroupedData(ORDER_STATUSES.map((status) => {
        const data = groupedData[status];

        if(!data) return;

        return {
          [status]: data
        }
      }).filter(Boolean) as unknown as Dictionary<IOrderView[]>);
    }

    setGroupedData(groupedData);
  },[props.groupActive, rowData]);

  useEffect(() => {
    if(!option) return;

    if(option === 'View Order') {
      openViewOrder();
    } else if(option === 'Record Deposit') {
      openRecordDeposit();
    } else if(option === 'Record Payment') {
      openRecordPayment();
    } else if(option === 'Manage Contracts') {
      openUploadContract();
    } else if(option === 'Manage Customer Invoice') {
      openUploadInvoice();
    } else if(option === 'Update Order Tracker') {
      openVehicleStatus();
    } else if(option === 'Cancel Order') {
      openCancelOrder();
    }

    setOption(null);
  },[option]);

  useEffect(() => {
    setRowData(props.data);
  },[props.data]);

  return (
    <div className='flex flex-col pb-4 h-full gap-y-2'>
      {viewOrderRef}
      {recordDepositRef}
      {recordPaymentRef}
      {uploadContractRef}
      {uploadInvoiceRef}
      {updateVehicleStatusRef}
      {cancelOrderRef}

      {props.groupActive !== 'all' ? (
        Object.entries(groupedData).map(d => {
          const key = d[0];
          const rowsData = (rowsSelected?.find(r => r.key === key)?.rowsSelected ?? []);

          return (
            <div key={key} className='h-full'>
              <div className='flex gap-x-2 px-8 text-neutrals-high body_small_bold bg-white' key={key}>
                <div className='flex gap-x-2 border-t-[3px] border-t-neutrals-medium px-4 py-3 bg-neutrals-background-surface'>
                  <span className='flex gap-x-2 items-center'>{key}</span>
                  <span className='text-center text-neutrals-default bg-neutrals-low body_small_regular w-[25px] h-[20px]'>{d?.[1]?.length ?? 0}</span>
                </div>

                {groupActions && rowsData.length >= 2 && (
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

              <div style={{ width: '100%', height: `${34 * (d?.[1]?.length + 1) + 10}px` }}>
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
                  onRowSelected={(event) => {
                    if(!event.node.isSelected()) {
                      setRowsSelected((current) => {
                        const rowData = current?.find((r) => r.key === d[0]);
                        return [
                          ...(current ?? [])?.filter((r) => r.key !== d[0]),
                          {
                            key: d[0],
                            rowsSelected: rowData?.rowsSelected.filter((r) => r.rowIndex !== event.rowIndex).filter(Boolean) as IRowNode<IOrderView>[] ?? []
                          }
                        ];
                      });
                      return;
                    }

                    const isExisting = rowsSelected?.find((r) => r.key === d[0]);

                    if(!isExisting) {
                      setRowsSelected((current) => {
                        return [
                          ...(current ?? []),
                          {
                            key: d[0],
                            rowsSelected: event.node ? [event.node] : []
                          }
                        ];
                      });
                    } else {
                      setRowsSelected((current) => {
                        const rowData = current?.find((r) => r.key === d[0]);
                        return [
                          ...(current ?? [])?.filter((r) => r.key !== d[0]),
                          {
                            key: d[0],
                            rowsSelected: event.node ? [...rowData?.rowsSelected.map(d => d) as IRowNode<IOrderView>[], event.node] : []
                          }
                        ];
                      });
                    }
                  }}
                />
              </div>
            </div>
          );
        })
      ):(
        <div
          // define a height because the Data Grid will fill the size of the parent container
          style={{ width: '100%', height: '100%' }}
        >
          <AgGridReact<IOrderView>
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
            pagination={true}
            paginationPageSize={20}
          />
        </div>
      )}
    </div>
  );
}