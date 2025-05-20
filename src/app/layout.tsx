'use client';

import type { Metadata } from "next";
import ChakraProviderWrapper from "./chakra-provider";
import Sidebar, { SidebarItem } from "@/components/Sidebar/Sidebar";
import styles from './globals.module.css';
import { usePathname } from "next/navigation";
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import "./globals.css";
import '@mantine/carousel/styles.css';
import { FloatingWidget } from "@/components/FloatingWidget/FloatingWidget";
import { AuthProvider } from "@/lib/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from "react-toastify";
import { AppDataInitializer } from "@/components/AppDataInitializer/AppDataInitializer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const excludedRoutes = ["/login", "/home", "/"];
  const queryClient = new QueryClient();

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className="font-aston"
      >
        <main className={styles.root}>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <AppDataInitializer />
              <ChakraProviderWrapper>
                <div className="flex flex-row h-screen">
                  <MantineProvider>
                    {!excludedRoutes.includes(pathname) && <Sidebar />}
                    <div className="flex flex-col w-full overflow-x-hidden pb-4 bg-neutrals-background-surface h-screen">
                      {children}
                      <ToastContainer />
                      {!excludedRoutes.includes(pathname) && <FloatingWidget />}
                    </div>
                  </MantineProvider>
                </div>
              </ChakraProviderWrapper>
            </QueryClientProvider>
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}
