import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { provideHttpClient } from '@angular/common/http';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import {
  DashboardOutline,
  TeamOutline,
  GoldOutline,
  DollarCircleOutline,
  ReconciliationOutline,
  UserAddOutline,
  SettingOutline,
  MenuUnfoldOutline,
  MenuFoldOutline,
  SearchOutline,
  BellOutline,
  UserOutline,
  ThunderboltFill,
  PlusOutline,
  EditOutline,
  DeleteOutline,
  AppstoreOutline,
  LogoutOutline,
  ShopOutline,
  ScheduleOutline,
  SafetyOutline,
  SafetyCertificateOutline,
  FileTextOutline,
  PercentageOutline,
  TagsOutline,
  BarcodeOutline,
  LockOutline,
  EyeOutline,
  EyeInvisibleOutline,
  InfoCircleOutline
} from '@ant-design/icons-angular/icons';

registerLocaleData(en);

import { routes } from './app.routes';

const icons = [
  DashboardOutline,
  TeamOutline,
  GoldOutline,
  DollarCircleOutline,
  ReconciliationOutline,
  UserAddOutline,
  SettingOutline,
  MenuUnfoldOutline,
  MenuFoldOutline,
  SearchOutline,
  BellOutline,
  UserOutline,
  ThunderboltFill,
  PlusOutline,
  EditOutline,
  DeleteOutline,
  AppstoreOutline,
  LogoutOutline,
  ShopOutline,
  ScheduleOutline,
  SafetyOutline,
  SafetyCertificateOutline,
  FileTextOutline,
  PercentageOutline,
  TagsOutline,
  BarcodeOutline,
  LockOutline,
  EyeOutline,
  EyeInvisibleOutline,
  InfoCircleOutline
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNzI18n(en_US),
    provideHttpClient(),
    provideNzIcons(icons)
  ]
};

