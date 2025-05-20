import { ArrowIcon, CheckIcon, ChevronUpIcon, NotificationIcon, TrashIcon } from '@/assets/icons';
import api from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { ActionIcon, Divider, Popover, ScrollArea } from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Loader } from '../ui/Loader/Loader';
import { useRouter } from 'next/navigation';

interface INotification {
  id: string;
  logo: React.ReactNode;
  type: string;
  title: string;
  description: string;
  data: string | Record<string, any>;
  action: string;
  actionPath?: string | null;
  opened?: boolean;
  uid: string;
  deletable: boolean,
  createdDate:string
}

interface INotificationResponse {
  type: string;
  subject: string;
  body: string;
  actionLabel: string;
  actionPath?: string | null;
  uid: string;
  status: string;
  deletable: boolean
  createdDate:string
}

export const Notification: React.FC = () => {
  const { firestoreUid } = useAuth();
  const [isHovered, setIsHovered] = React.useState(false);
  const [opened, setOpened] = React.useState(false);
  const [notifications, setNotifications] = React.useState<INotification[]>([]);
  const router = useRouter();
  const {
    data: notificationsData,
    isLoading: isLoadingNotifications,
    error: errorNotifications,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get(`/notification?userUid=${firestoreUid}`).then(res => res.data as INotificationResponse[]),
  });

  useEffect(() => {
    if (notificationsData) {
      setNotifications(
        notificationsData
          .filter(n => n.status !== 'READ')
          .map((notification, index) => {
            let description = notification.body;
            const result: Record<string, string> = {};
               if (notification.body?.includes('\n')) {
            const lines = notification.body.split('\n').map(line => line.trim());

            // Find first non-empty line as description
            const firstNonEmptyLineIndex = lines.findIndex(line => line !== '');
            description = lines[firstNonEmptyLineIndex] || '';

            // Look for a blank line after the description
            const blankLineAfterDescriptionIndex = lines.findIndex(
              (line, idx) => idx > firstNonEmptyLineIndex && line === ''
            );

            // Start processing key-value lines after the blank line
            const dataStartIndex = blankLineAfterDescriptionIndex + 1;
            for (let i = dataStartIndex; i < lines.length; i++) {
              const line = lines[i];
              if (line.includes(':')) {
                const [key, ...rest] = line.split(':');
                result[key.trim()] = rest.join(':').trim().replace(/#$/, '');
              }
            }
          }

            return {
              id: `${index + 1}`,
              uid: notification.uid,
              logo: (
                <div className="bg-brand-primary p-1">
                  <CheckIcon className="text-white" width={24} height={24} />
                </div>
              ),
              type: notification.type,
              actionPath: notification?.actionPath,
              title: notification.subject,
              description,
              data: result,
              deletable: notification.deletable,
              action: notification.actionLabel,
              createdDate:notification.createdDate
            };
          })
      );
    } else {
      setNotifications([]);
    }
  }, [notificationsData]);

  useEffect(() => {
    if (errorNotifications) {
      setNotifications([]);
      toast.error('Error in fetching notifications');
    }
  }, [errorNotifications]);

  const { mutate: updateNotificationStatus, isPending: isUpdateNotificationStatus } = useMutation({
    mutationFn: (notificationUid: string) => api.patch(`/notification/${notificationUid}`),
    onMutate() { },
    onSuccess(data, variables, context) {
      console.log('Notification status updated successfully:', data, variables);
      setNotifications(notifications => notifications.filter(item => item.uid !== data?.data?.uid));
    },
    onError(error) {
      console.error('Error notification status update:', error);
      toast.error('Error in notification status update');
    },
  });

  return (
    <>
      {opened && <div className="fixed inset-0 bg-black bg-opacity-20 z-50 backdrop-blur-sm" onClick={() => setOpened(false)} />}
      <Popover
        width={371}
        trapFocus
        classNames={{ dropdown: 'py-4 mr-4 rounded-none' }}
        opened={opened}
        onChange={setOpened}
        keepMounted
        closeOnClickOutside
        onClose={() => setOpened(false)}
        withinPortal
      >
        <Popover.Target>
          <div className="flex items-center text-center justify-center size-12 ml-auto" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            {isLoadingNotifications ? (
              <Loader />
            ) : (
              <ActionIcon variant="transparent" className={clsx('relative w-full h-full hover:bg-brand-primary', opened && 'bg-brand-primary z-50')} onClick={() => setOpened(!opened)}>
                {notifications?.length > 0 && (
                  <div
                    className={clsx(
                      'flex items-center text-center justify-center absolute bottom-6 right-1 rounded-full text-neutrals-background-default size-5',
                      isHovered || opened ? 'bg-brand-secondary' : 'bg-brand-primary'
                    )}
                  >
                    <p className={clsx('caption_semibold', isHovered || opened ? 'bg-brand-secondary text-neutrals-high' : 'bg-brand-primary')}>{notifications?.length}</p>
                  </div>
                )}
                <NotificationIcon className={clsx('text-neutrals-high', isHovered || opened ? 'text-white' : 'text-neutrals-high')} />
              </ActionIcon>
            )}
          </div>
        </Popover.Target>
        <Popover.Dropdown className="flex flex-col gap-y-4 min-w-[370px] shadow-subtle-shadow-3 border-[1px] border-neutrals-low">
          <div className="sub_heading_3_semibold text-neutrals-high">Notifications</div>
          {notifications?.length > 0 && (
            <ScrollArea.Autosize mah={448} classNames={{ thumb: '!rounded-none bg-brand-primary' }} offsetScrollbars type="auto">
              {notifications.map((notification, i) => (
                <>
                  <div key={notification.id} className="flex flex-col gap-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-x-3 items-start">
                        {notification.logo}
                        <div className="flex flex-col">
                          <p className="text-neutrals-high body_small_semibold">{notification.title}</p>
                          <p className="caption_regular text-neutrals-medium">{notification.description}</p>
                        </div>
                      </div>

                      <ActionIcon
                        variant="transparent"
                        className={clsx(notification.opened && 'rotate-180 transform duration-300', !notification.opened && 'rotate-0 transform duration-300')}
                        onClick={() => {
                          setNotifications(notifications =>
                            notifications.map(item => {
                              if (item.id === notification.id) {
                                return { ...item, opened: !item.opened };
                              }
                              return item;
                            })
                          );
                        }}
                      >
                        <ChevronUpIcon className="text-neutrals-high" />
                      </ActionIcon>
                    </div>

                    {notification.opened && (
                      <>
                        <div className="flex gap-x-10 gap-y-2 bg-neutrals-background-surface px-2 py-3">
                          {typeof notification.data === 'string' ? (
                            <div className="text-neutrals-high caption_small_regular">{notification.data}</div>
                          ) : (
                            Object.keys(notification.data).length > 0 && (
                              <>
                                <div>
                                  {Object.keys(notification.data).map(key => (
                                    <div key={key} className="caption_small_regular text-neutrals-high">
                                      {key}:
                                    </div>
                                  ))}
                                </div>

                                <div>
                                  {Object.values(notification.data).map((value, index) => (
                                    <div key={index} className="caption_small_regular text-neutrals-medium">
                                      {value}
                                    </div>
                                  ))}
                                </div>
                              </>
                            )
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex border-b-[1px] border-b-brand-primary cursor-pointer" onClick={() => {
                            if (notification.actionPath && notification.action === "Assign New Lead")
                              router.push(`/${notification?.actionPath}`);
                          }}>
                            <p className="caption_regular text-brand-primary">{notification.action}</p>
                            <p>
                              <ArrowIcon className="text-brand-primary" />
                            </p>
                          </div>
                          {notification.deletable &&
                            <ActionIcon loading={isUpdateNotificationStatus} variant="transparent" onClick={() => updateNotificationStatus(notification?.uid)}>
                              <TrashIcon width={20} height={20} className="text-indications-red" />
                            </ActionIcon>
                          }

                        </div>
                      </>
                    )}
                  </div>
                  {notifications.length - 1 > i && <Divider mt={10} mb={14} />}
                </>
              ))}
            </ScrollArea.Autosize>
          )}
          {notifications?.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-y-4 min-h-[448px]">
              <NotificationIcon width={56} height={56} className="text-neutrals-medium" />
              <p className="caption_regular text-neutrals-medium">No notifications in your inbox.</p>
            </div>
          )}
        </Popover.Dropdown>
      </Popover>
    </>
  );
};
