'use client';

import { KeyboardArrowLeftIcon } from "@/assets/icons";
import { Header } from "@/components/Header/Header";
import { ActionIcon } from "@mantine/core";
import { LeftSection } from "./left-section";
import { MiddleSection } from "./middle-section";
import { RightSection } from "./right-section";
import { useRouter } from "next/navigation";

export default async function Page({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
    const router = useRouter();

    return (
      <div>
        <Header
          title="Contact Life Cycle"
          subtitle="Overview / Contact Details"
          childrenClassName="!pb-0 flex flex-col gap-y-10 pt-6 bg-white"
        >
          <div className="pb-4 w-full">
            <ActionIcon variant="transparent" className="w-fit" onClick={() => router.push('/contact-life-cycle/overview')}>
              <div className="flex items-center gap-x-2">
                <div>
                  <KeyboardArrowLeftIcon className="text-brand-primary" width={24} height={24} />
                </div>
                <div>
                  <p className="body_regular_semibold text-brand-primary">Overview</p>
                </div>
              </div>
            </ActionIcon>
          </div>  
        </Header>
        <div className="flex h-full">
          <LeftSection />
          <MiddleSection />
          <RightSection />
        </div>
      </div>
    );
  }