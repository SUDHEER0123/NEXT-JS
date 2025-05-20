               import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { AllCommunityModule, ClientSideRowModelModule, ColDef, ICellRendererParams, ModuleRegistry, RowSelectionModule, themeQuartz, iconOverrides, IRowNode, ValueFormatterParams, ValueGetterParams } from 'ag-grid-community'; 
import React, { useEffect, useMemo, useState } from 'react';
import { ActionMenu} from '@/components/ActionMenu/action-menu';
import groupBy from 'lodash-es/groupBy';
import { Dictionary } from 'lodash';
import { Button } from '@mantine/core';
import Image from 'next/image';
import { ILead, IContact, IVehicle, IProspect } from '@/app/types';
import { SearchInput } from '@/components/SearchInput/SearchInput';
import { useContactLifeCycleStore } from './contact-life-cycle.store';
import { actionMenuItems } from './content';
import { useAppDataStore } from '@/app/app.store';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '@/utils/dateFormatter';
export interface IContactsTable {
  data: IContact[];
  groupActive?: string;
}

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
  RowSelectionModule
]);

export const ContactsTable: React.FC<IContactsTable> = (props) => {
  const gridRef = React.createRef<AgGridReact<IContact>>();
  const { rowsSelected, setRowsSelected } = useContactLifeCycleStore();
  const { users, modelTypes } = useAppDataStore();
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

  const { data: vehicles, isLoading: isLoadingVehicles, error: errorGettingVehicle } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.get('/vehicle').then(res => res.data as IVehicle[])
  });

  const { data: leads, isLoading: isLoadingLeads, error: errorGettingLeads } = useQuery({
    queryKey: ['leads'],
    queryFn: () => api.get('/contact/lead').then(res => res.data as ILead[])
  });

  const { data: prospects, isLoading: isLoadingProspects, error: errorGettingProspects } = useQuery({
    queryKey: ['leads'],
    queryFn: () => api.get('/prospect').then(res => res.data as IProspect[])
  });

  // Column Definitions: Defines the columns to be displayed.
  const colDefs: ColDef[] = useMemo(() => [
    {
      field: "fullNameEN",
      headerName: 'Name',
      sortable: true,
      flex: 1
    },
    {
      field: "mobileNo.phoneNumber",
      headerName: 'Phone Number',
      sortable: true,
      flex: 1
    },
    {
      field: "ownerUserUid",
      headerName: 'Contact Owner',
      sortable: true,
      flex: 1,
      valueGetter: (params: ValueGetterParams) => {
        const user = users?.find((user) => user.uid === params.data.ownerUserUid);

        return user ? `${user.firstName} ${user.lastName}` : '';
      }
    },
    { field: "email", headerName: 'Email', sortable: true, minWidth: 150, flex: 1 },
    {
      field: "vehicle",
      headerName: 'Vehicle',
      sortable: true,
      flex: 1,
      valueGetter: (params: ValueGetterParams) => {
        const vehicleContact = vehicles?.find((vehicle) => vehicle.contactUid === params.data.uid);
        return modelTypes?.find(modelType => modelType.uid === vehicleContact?.modelTypeUid)?.displayName;
      },
      hide: props.groupActive !== 'Customers' && props.groupActive !== 'Contracted'
    },
    {
      field: "vehicleInterest-leads",
      headerName: 'Vehicle Interest',
      sortable: true,
      flex: 1,
      valueGetter: (params: ValueGetterParams) => {
        return leads?.find((lead) => lead.contactUid === params.data.uid)?.vehicleInterest?.map((vehicle) => vehicle).join(', ')
      },
      hide: props.groupActive !== 'Lead'
    },
    {
      field: "vehicleInterest-prospects",
      headerName: 'Vehicle Interest',
      sortable: true,
      flex: 1,
      valueGetter: (params: ValueGetterParams) => {
        return prospects?.find((prospect) => prospect.contactUid === params.data.uid)?.vehicleInterest?.map((vehicle) => vehicle).join(', ')
      },
      hide: props.groupActive !== 'Prospect'
    },
    {
      field: "status",
      headerName: "Loyalty Status",
      flex: 1
    },
    {
      field: 'recordDateTime',
      headerName: 'Customer Since',
      valueFormatter: (params: ValueFormatterParams) => {
        return formatDate(params.value) ;
      },
      flex: 1
    },
    {
      field: "type",
      headerName: 'Contact Type',
      sortable: true,
      hide: props.groupActive !== 'All Contacts',
      flex: 1
    },
    {
      field: "leadSource",
      headerName: "Lead Source",
      sortable: true,
      width: 150,
      hide: props.groupActive !== 'Leads',
      flex: 1
    },
    {
      field: "action",
      headerName: "",
      sortable: false,
      resizable: false,
      maxWidth: 50,
      pinned: 'right',
      cellRenderer: (params: ICellRendererParams) => {
        return (
          <div className='mt-1'>
            <ActionMenu
              actionMenuItems={actionMenuItems}
              onOptionSubmit={(option) => {
              }}
            />
          </div>
        )
      }
    }
  ], [props.groupActive]);

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col bg-white'>
        <div className='flex gap-x-3 px-4 py-2 items-center'>
          <div className='flex gap-x-2 text-neutrals-high body_small_bold bg-white'>
            {(rowsSelected?.length ?? 0) >= 2 && (
              <div className='flex items-center gap-x-3 px-2 py-1 text-neutrals-high gap-x-2 bg-indications-bg_warning_soft border-[0.5px] border-indications-warning h-[40px] mt-1'>
                <div className='flex gap-x-3'>
                  <div className='flex gap-x-1'>
                    <span className='body_small_bold'>{rowsSelected?.length}</span>
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
                      <Image src="/icons/entering-geo-fence.svg" width={16} height={16} alt="change-status" />
                    }
                  >
                    <p>Assign</p>
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
                  <Button
                    className='bg-neutrals-background-default text-neutrals-high caption_regular hover:bg-neutrals-background-default hover:text-neutrals-high !py-1.5 !px-2.5 border-[1px] border-neutrals-low rounded-none h-[30px]'
                    onClick={() => {}}
                    variant='unstyled'
                    leftSection={
                      <Image src="/icons/delete-03.svg" width={16} height={16} alt="change-status" />
                    }
                  >
                    <p>Delete</p>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          // define a height because the Data Grid will fill the size of the parent container
          style={{ width: '100%', height: '100%' }}
        >
          <AgGridReact<IContact>
            ref={gridRef}
            rowData={props.data}
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
            onRowSelected={(event) => {
              setRowsSelected(gridRef?.current?.api?.getSelectedRows() ?? []);
            }}
            loading={isLoadingVehicles || isLoadingLeads || isLoadingProspects}
          />
        </div>
      </div>
    </div>
  );
}