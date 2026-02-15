import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideNzI18n, es_ES } from 'ng-zorro-antd/i18n';
import { provideNzConfig } from 'ng-zorro-antd/core/config';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

import { routes } from './app.routes';

import { provideNzIcons } from 'ng-zorro-antd/icon';
import {
  ThunderboltFill,
  UserOutline,
  LockOutline,
  EyeOutline,
  EyeInvisibleOutline,
  CloseCircleOutline,
  InfoCircleOutline
} from '@ant-design/icons-angular/icons';

// Register Spanish locale
registerLocaleData(es);

const icons = [
  ThunderboltFill,
  UserOutline,
  LockOutline,
  EyeOutline,
  EyeInvisibleOutline,
  CloseCircleOutline,
  InfoCircleOutline
];

// MINIMAL CONFIG FOR DEBUGGING NG0203
// Temporarily removed all providers to isolate the error
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideNzI18n(es_ES),
    provideNzIcons(icons),
    provideNzConfig({
      theme: {
        primaryColor: '#0284C7',
      },
      notification: {
        nzPlacement: 'topRight',
        nzDuration: 4500,
      },
      message: {
        nzDuration: 3000,
        nzMaxStack: 3,
      },
      table: {
        nzBordered: true,
        nzSize: 'middle',
      },
    })
  ]
};
