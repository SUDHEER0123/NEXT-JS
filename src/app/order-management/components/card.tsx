'use client';

import { ActionIcon, Card, Group, Menu, Text } from "@mantine/core";
import Image from "next/image";

interface IOrderCard {
  title: string;
  description?: string;
  className?: string;
  cardImage?: React.ReactNode;
}

interface ActionItem {
  label: string;
  icon: React.ReactNode;
  color?: string;
}

export const OrderCard: React.FC<IOrderCard> = ({ title, description, className, cardImage }) => {
  const menuItems: ActionItem[] = [
    { label: "View Order", icon: <Image src="/icons/edit.svg" alt="edit" width={24} height={24} /> },
    { label: "Record Deposit", icon: <Image src="/icons/delete.svg" alt="delete" width={24} height={24} /> },
    { label: "Record Payment", icon: <Image src="/icons/delete.svg" alt="delete" width={24} height={24} /> },
    { label: "Upload Contract", icon: <Image src="/icons/delete.svg" alt="delete" width={24} height={24} /> },
    { label: "Manage Customer Invoice", icon: <Image src="/icons/delete.svg" alt="delete" width={24} height={24} /> },
    { label: "Update Order Tracker", icon: <Image src="/icons/delete.svg" alt="delete" width={24} height={24} /> },
    { label: "Cancel Order", icon: <Image src="/icons/delete.svg" alt="delete" width={24} height={24} />, color: "red" },
  ];

  return (
    <Card withBorder shadow="sm" radius="md">
      <Card.Section mt="sm">
        {title}
      </Card.Section>
      <Card.Section>
        {description}
      </Card.Section>

      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <Image src="/icons/more-horizontal.svg" width={24} height={24} alt="more" />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              {menuItems.map(menuItem => (
                <Menu.Item leftSection={menuItem.icon}>
                  {menuItem.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>

    </Card>
  );
};