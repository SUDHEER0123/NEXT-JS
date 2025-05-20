'use client';

import { Button, Drawer as MantineDrawer, DrawerProps } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';

interface IDrawer extends DrawerProps {
  title: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<IDrawer> = ({ title, children, opened, onClose, ...props }) => {
  return (
    <>
       <MantineDrawer
        opened={opened}
        onClose={() => {
          onClose();
        }}
        title={title}
        position="right"
        size={500}
        classNames={{
          root: 'shadow-drawer',
          header: 'bg-neutrals-high text-neutrals-background-default',
          close: 'text-white hover:bg-neutrals-medium',
          title: 'text-neutrals-background-default !text-sub-heading-3-semi-bold !font-sub-heading-3-semi-bold',
          overlay: 'backdrop-blur-[15px]',
          body: 'flex flex-col gap-y-4 !p-0',
        }}
        {...props}
      >
        {children}
      </MantineDrawer>
    </>
  );
};

export const useDrawer = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return { opened, open, close };
};