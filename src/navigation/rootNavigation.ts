import { createNavigationContainerRef } from '@react-navigation/native';
import type * as Notifications from 'expo-notifications';
import type { MainStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<MainStackParamList>();

let pendingResponse: Notifications.NotificationResponse | null = null;

export function queueNotificationResponse(
  response: Notifications.NotificationResponse,
) {
  pendingResponse = response;
  openPendingNotification();
}

export function openPendingNotification() {
  if (!pendingResponse || !navigationRef.isReady()) return;
  if (!navigationRef.getRootState().routeNames.includes('Home')) return;

  pendingResponse = null;
  navigationRef.navigate('Home', { screen: 'HomeTab' });
}
