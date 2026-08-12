import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../auth/AuthProvider';
import {
  queueNotificationResponse,
} from '../navigation/rootNavigation';
import { syncExpoPushToken } from '../api/expoPushNotification';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const received = Notifications.addNotificationReceivedListener(
      () => undefined,
    );
    const responded = Notifications.addNotificationResponseReceivedListener(
      queueNotificationResponse,
    );

    void Notifications.getLastNotificationResponseAsync().then(
      async (response) => {
        if (!response) return;
        queueNotificationResponse(response);
        await Notifications.clearLastNotificationResponseAsync();
      },
    );

    return () => {
      received.remove();
      responded.remove();
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) void syncExpoPushToken().catch(() => undefined);
  }, [isAuthenticated]);
}
