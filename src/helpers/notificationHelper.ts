import { Notification } from '../app/modules/notification/notifications.model';

export const sendNotifications = async (data: any) => {
  const result = await Notification.create(data);

  //@ts-ignore
  const socketIo = global.io;

  if (data?.type === 'ADMIN') {
    socketIo.emit(`get-notification::${data?.type}`, result);
  } else {
    socketIo.emit(`get-notification::${data?.receiver}`, result);
  }

  return result;
};
