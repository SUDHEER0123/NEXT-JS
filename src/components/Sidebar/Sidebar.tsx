"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Box, VStack, Text, HStack, IconButton } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import styles from "./Sidebar.module.css";
import classNames from "classnames";
import { AvatarGroup, Avatar } from "../ui/avatar";
import clsx from "clsx";
import { Select } from "../ui/Select/Select";

const cx = classNames.bind(styles);
export interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  type: string;
  permission?: boolean;
};

interface ISidebar {

}

const languages = [
  { label: "English", value: "English" },
  { label: "한국", value: "한국" }
];

const sidebarVariants = {
  open: { width: 200 },
  closed: { width: 60 },
};

const DashboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2H2V10H10V2Z" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
    <path d="M22 2H14V10H22V2Z" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
    <path d="M10 14H2V22H10V14Z" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
    <path d="M22 14H14V22H22V14Z" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
  </svg>
);

const ContactLifeCycleIcon = () => (
  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22L10 16H2L4 22H15.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 13V9.5C4 8.94772 4.44772 8.5 5 8.5H11C11.5523 8.5 12 8.94772 12 9.5V13" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 22H21C21.5523 22 22 21.5523 22 21V18.5C22 17.9477 21.5523 17.5 21 17.5H14" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.0194 13C19.0194 14.1046 18.1232 15 17.0175 15C15.9119 15 15.0156 14.1046 15.0156 13C15.0156 11.8954 15.9119 11 17.0175 11C18.1232 11 19.0194 11.8954 19.0194 13Z" stroke="currentColor" strokeWidth="0.9"/>
    <path d="M10.0038 4C10.0038 5.10457 9.10753 6 8.00191 6C6.89628 6 6 5.10457 6 4C6 2.89543 6.89628 2 8.00191 2C9.10753 2 10.0038 2.89543 10.0038 4Z" stroke="currentColor" strokeWidth="0.9"/>
  </svg>
);

const EngagementIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.75 15.75H2.25V2.25" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
    <path d="M5.25 3H7.5" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
    <path d="M5.25 5.25H9.75" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
    <path d="M2.625 15.375L7.5 9L10.5 11.25L14.25 7.5" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
  </svg>
);

const OrderManagementIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 6H16.5V3C16.5 2.17157 15.8284 1.5 15 1.5C14.1716 1.5 13.5 2.17157 13.5 3V6Z" stroke="currentColor" strokeWidth="0.9"/>
    <path d="M4.5 4.5H10.5" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
    <path d="M6.75 7.5H4.5" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
    <path d="M12 10.5341V10.1932H10.7613L11 9H10.5L10 12.0682L9.25 9.51136H8.75L8 12.0682L7.5 9H7L7.23875 10.1932H6V10.5341H7.30675L7.409 11.0455H6V11.3864H7.47725L7.75 12.75H8.25L9 10.1932L9.75 12.75H10.25L10.5227 11.3864H12V11.0455H10.591L10.6933 10.5341H12Z" fill="currentColor" stroke="currentColor" strokeWidth="0.2"/>
    <path d="M13.505 5.33639V16.0591C13.505 16.1159 13.4442 16.1522 13.3942 16.1251L10.6807 14.6526L7.44107 16.4888C7.41767 16.502 7.38897 16.5017 7.36584 16.488L4.273 14.6526L1.61141 16.1317C1.56143 16.1594 1.5 16.1233 1.5 16.0661V1.57505C1.5 1.5336 1.53358 1.5 1.575 1.5H15" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round"/>
  </svg>
);

const VehicleManagementIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.75 15C13.5784 15 14.25 14.3284 14.25 13.5C14.25 12.6716 13.5784 12 12.75 12C11.9216 12 11.25 12.6716 11.25 13.5C11.25 14.3284 11.9216 15 12.75 15Z" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
    <path d="M6.75 13.5C6.75 14.3284 6.07843 15 5.25 15C4.42157 15 3.75 14.3284 3.75 13.5C3.75 12.6716 4.42157 12 5.25 12C6.07843 12 6.75 12.6716 6.75 13.5Z" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
    <path d="M9.75 13.5H11.25M9.75 5.25H13.5L16.5 9V13.5H14.25" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
    <path d="M12 5.25V9H16.5" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
    <path d="M6.52174 13.5H9.75V3H1.5V13.5H3.75" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round"/>
  </svg>
);

const ContractsAndPaymentsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 4.125V1.5H1.5V16.5H13.5V13.875" stroke="currentColor" strokeWidth="0.9" strokeLinecap="square"/>
    <path d="M13.5 7.5L9.375 11.625L9 13.5L10.875 13.125L15 9M13.5 7.5L15 6L16.5 7.5L15 9M13.5 7.5L15 9" stroke="currentColor" strokeWidth="0.9" strokeLinecap="square"/>
    <path d="M3.75 14.25H4.5L5.4375 12.375L6.375 14.25H7.125" stroke="currentColor" strokeWidth="0.9" strokeLinecap="square"/>
    <path d="M4.5 4.5H10.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="square"/>
    <path d="M4.5 7.5H9" stroke="currentColor" strokeWidth="0.9" strokeLinecap="square"/>
  </svg>
);

const AdministrationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.75 7.875C13.7855 7.875 14.625 7.03553 14.625 6C14.625 4.96447 13.7855 4.125 12.75 4.125M16.5 13.5C16.5 11.429 14.821 9.75 12.75 9.75" stroke="currentColor" strokeWidth="0.9"/>
    <path d="M5.24998 7.875C4.21445 7.875 3.37498 7.03553 3.37498 6C3.37498 4.96447 4.21445 4.125 5.24998 4.125M1.5 13.5C1.5 11.429 3.17893 9.75 5.25 9.75" stroke="currentColor" strokeWidth="0.9"/>
    <path d="M11.625 5.625C11.625 7.07475 10.4497 8.25 9 8.25C7.55025 8.25 6.375 7.07475 6.375 5.625C6.375 4.17525 7.55025 3 9 3C10.4497 3 11.625 4.17525 11.625 5.625Z" stroke="currentColor" strokeWidth="0.9"/>
    <path d="M3.75 15H14.25C14.25 12.5147 11.8995 10.5 9 10.5C6.10051 10.5 3.75 12.5147 3.75 15Z" stroke="currentColor" strokeWidth="0.9"/>
  </svg>
);

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon />, type: 'link', permission: true },
  { label: "Contact Life Cycle", path: "/contact-life-cycle/overview", icon: <ContactLifeCycleIcon />, type: 'link', permission: true },
  { label: "Engagement", path: "/engagement", icon: <EngagementIcon />, type: 'link', permission: false },
  { label: "Order Management", path: "/order-management", icon: <OrderManagementIcon />, type: 'link', permission: true },
  { label: "Vehicle Management", path: "/vehicle-management", icon: <VehicleManagementIcon />, type: 'link', permission: true },
  { label: "Contracts & Payments", path: "/contracts-and-payments", icon: <ContractsAndPaymentsIcon />, type: 'link', permission: true },
  { label: "Administration", path: "/administration", icon: <AdministrationIcon />, type: 'link', permission: false},
];

const Sidebar: React.FC<ISidebar> = () => {
  const pathname = usePathname();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [value, setValue] = useState(languages[0].value);
  const router = useRouter();

  return (
    <div
      className={`bg-neutrals-background-surface flex flex-col h-screen`}
    >
      <div className={`flex flex-col items-center gap-y-4 ${collapsed ? 'w-[60px]':'w-[185px]'} transition-all ease-in-out duration-100`}>
        <Image
          src="/images/logomark_color.png"
          width={collapsed ? 50 : 134}
          height={56}
          alt="logomark_color"
          className="self-center pt-4 cursor-pointer"
          onClick={() =>router.push('/home')}
        />
        <div className="w-full flex flex-col items-start justify-center">
          {sidebarItems.filter(s => s.permission).map((item) => (
            <Link
                key={item.path}
                href={item.path}
                className="w-full"
                onClick={() => {
                  setSelectedItem(item.path);
                }}
              >    
                <div
                  className={clsx(
                    "w-full h-[42px] flex flex-row items-center text-xs hover:bg-brand-primary hover:text-neutrals-background-default cursor-pointer",
                    collapsed && 'justify-center',
                    !collapsed && 'pl-4',
                    pathname === item.path && 'bg-neutrals-high text-neutrals-background-default',
                  )}
                  onClick={() => {
                    setSelectedItem(item.path);
                  }}
                  key={item.path}
                >
                  <Box
                    borderRadius="md"
                    background={pathname === item.path ? "gray.700" : "transparent"}
                  >
                    <HStack>
                      {item.icon}
                      {!collapsed && (
                        <Text
                          className={`${selectedItem === item.path ? '' : 'hover:text-neutrals-background-default'} transition-transform duration-75`}
                        >
                          {item.label}
                        </Text>
                      )}
                    </HStack>
                  </Box>
                </div>
              </Link>
          ))}

          <div className={clsx("flex gap-x-2 w-full pl-4 cursor-pointer", collapsed && 'ml-1 pt-2')}>
            <Image src="/icons/language.svg" width={18} height={18} alt="language" />
            {!collapsed && (
              <Select 
                items={languages}
                withOptionsDivider={false}
                withDivider={false}
                value={value}
                onOptionSubmit={(value) => setValue(value)}
                valueClassName="caption_regular"
                dropdownClassName="!ml-0 !shadow-none !bg-transparent"
                optionsClassName="border-l-2 border-l-neutrals-low"
                dropdownProps={{
                  left: '1.3%'
                }}
                optionClassName="!ml-2"
              />
            )}
          </div>

        </div>  
      </div>
      <div className="flex flex-col space-y-4 mt-auto p-4">
        <HStack gapX="4">
          <AvatarGroup>
            <Avatar shape="full" size="lg" name="Yong Soo-Yun" src="/images/profile.svg" />
          </AvatarGroup>
          {!collapsed && (
            <VStack gap="2" align="flex-start">
              <Text className="text-neutrals-high text-sm">
                Yong Soo-Yun
              </Text>
              <Text className="text-neutrals-medium text-xs">
                Service Advisor
              </Text>
            </VStack>
          )}
        </HStack>
        <div className="w-full pt-4 border-t-2 border-t-neutrals-low">
          <IconButton 
            onClick={() => setCollapsed(!collapsed)}
          >
            <HStack>
              <Image 
                src="/icons/collapse-sidebar.svg"
                alt="collapse-sidebar"
                width={20}
                height={20} 
                className={cx({
                  'rotate-180 transform duration-200': collapsed,
                  'rotate-360 transform duration-200': !collapsed,
                })}
              />
              {!collapsed && <Text fontSize="xs" className="font-normal text-xs text-neutrals-medium">Collapse view</Text>}
            </HStack>
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
