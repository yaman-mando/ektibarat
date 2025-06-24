import type { HubConnection } from '@microsoft/signalr';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

// eslint-disable-next-line import/no-mutable-exports
export let chatHub: HubConnection | null = null;

export const buildHub = (token: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    chatHub = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl('https://studentexam.ekhtibarat.com/notificationsHub', {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    chatHub.onclose((error) => {
      console.warn('🚫 الاتصال مغلق:', error);
    });

    chatHub.onreconnecting((error) => {
      console.info('🔁 إعادة محاولة الاتصال...', error);
    });

    chatHub.onreconnected((connectionId) => {
      console.info('✅ أعيد الاتصال بنجاح:', connectionId);
    });

    chatHub
      .start()
      .then(() => {
        console.log('✅ تم الاتصال بـ SignalR');
        resolve(true);
      })
      .catch((e: unknown) => {
        console.error('❌ فشل الاتصال بـ SignalR:', e);
        reject(e);
      });
  });
};
