import type { NavigatorScreenParams } from '@react-navigation/native';
import type { MainTabParamList } from './MainTabsNavigator';

export type AuthStackParamList = {
  Login: undefined;
};

export type MainStackParamList = {
  Home: NavigatorScreenParams<MainTabParamList> | undefined;
  Language: undefined;
  BankManagement: undefined;
  WorkSchedule: undefined;
  EarningsDetail: undefined;
  EarningsOrderDetail: undefined;
};
