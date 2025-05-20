'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { formatDate } from "@/utils/dateFormatter";
import Image from "next/image";
import { Button } from "@mantine/core";
import { Select } from "@/components/ui/Select/Select";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { HomeCard, IHomeCard } from "./home-card";
import { AnalysisTextLinkIcon, CheckListIcon, Contracts02Icon, DashboardIcon, InvoiceIcon, MentoringIcon, TruckIcon, UserGroupIcon } from "@/assets/icons";
import { Loader } from "@/components/ui/Loader/Loader";

const homeItems: IHomeCard[] = [
  {
    title: 'Dashboard',
    description: 'Your overview of key insights and metrics at a glance.',
    icon: <DashboardIcon />,
    path: '/dashboard',
    permission: true
  },
  {
    title: 'Contact Life Cycle',
    description: 'Track and manage every stage of your customer interactions.',
    icon: <MentoringIcon />,
    path: '/contact-life-cycle/overview',
    permission: true
  },
  {
    title: 'Engagement',
    description: 'Drive deeper connections with timely and relevant engagements.',
    icon: <AnalysisTextLinkIcon />,
    path: '/engagement',
    permission: false
  },
  {
    title: 'Order Management',
    description: 'Managing all vehicle orders in one place',
    icon: <InvoiceIcon />,
    path: '/order-management',
    permission: true
  },
  {
    title: 'Vehicle Management',
    description: 'Efficiently manage the car park and streamlinee vehicle management.',
    icon: <TruckIcon />,
    path: '/vehicle-management',
    permission: true
  },
  {
    title: 'Contracts & Payments',
    description: 'Managing all contract and payment information in one place.',
    icon: <Contracts02Icon />,
    path: '/contracts-and-payments',
    permission: true
  },
  {
    title: 'PDI Management',
    description: 'Digitizing the Product Delivery Inspection experience.',
    icon: <CheckListIcon />,
    path: '/pdi-management',
    permission: false
  },
  {
    title: 'Administration',
    description: 'Manage users, settings, and system preferences effortlessly.',
    icon: <UserGroupIcon />,
    path: '/administration',
    permission: false
  }
]

export default function Home() {
  const { user, loading } = useAuth();
  const [date,setDate] = useState(new Date());
  const [value, setValue] = useState('English');
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  },[]);

  const languages = [
    { label: "English", value: "English" },
    { label: "한국", value: "한국" }
  ];

  if(loading) return null;

  return (
    <ProtectedRoute>
      <div className="flex flex-col relative">
        <Image src="/images/home-vector-1.svg" width={200} height={10} alt="home-vector-1" className="absolute top-0 left-0" />
        <Image src="/images/home-vector-2.svg" width={200} height={10} alt="home-vector-2" className="absolute top-0 right-0" />
        <div className="flex flex-row px-8 pt-6 leading-5 justify-between w-full">
          <div className="flex flex-col space-y-1 text-white">
            <p className="border-l-brand-secondary border-l-4 pl-3">Welcome {user?.displayName}</p>
            <p className="pl-4 text-xs font-thin">{formatDate(date, 'E, dd MMM yyyy hh:mm a')}</p>
          </div>
          <div className="flex flex-row space-x-2">
            <div className="flex gap-x-2 pl-4 border-[1px] border-neutrals-medium bg-[#707171B2]">
              <Image src="/icons/language-white.svg" width={18} height={18} alt="language" />
              <Select 
                items={languages}
                withOptionsDivider={true}
                withDivider={false}
                value={value}
                onOptionSubmit={(value) => setValue(value)}
                valueClassName="text-neutrals-background-default caption_regular"
                optionsClassName="w-[150px]"
                position="bottom-end"
                customRightSection={<Image src="/icons/keyboard_arrow_down-white.svg" width={10} height={6} alt="arrow" className="!text-neutrals-background-default" /> }
                wrapperClassName="bg-transparent"
              />
            </div>
            <Button
              variant="unstyled"
              className="text-indications-red bg-indications-bg_error_soft caption_regular rounded-none py-2 px-6 h-auto hover:bg-indications-bg_error_soft hover:text-indications-red"
              leftSection={
                <Image src="/icons/logout.svg" alt="logout" width={18} height={18} />
              }
              onClick={async() => {
                  await signOut(auth);
                  router.push("/login");
                }
              }
            >
              Logout
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <Image src="/images/logo-white.png" alt="Lagonda Logo" width={134} height={56} />
        </div>
        <div className="flex flex-col items-center justify-center h-full pt-[2rem]">
          <div className="flex flex-col items-center justify-center">
            <h1 className="!text-neutrals-low">Aston Martin Seoul</h1>
            <p className="text-white text-3xl pt-2">Your Modules</p>
          </div>
          <div className="grid grid-cols-4 gap-4 pt-12">
            {homeItems.map((item, index) => (
              <div>
                <HomeCard key={index} {...item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
