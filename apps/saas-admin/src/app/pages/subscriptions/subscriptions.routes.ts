
import { Routes } from '@angular/router';

export const SUBSCRIPTION_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'active',
        pathMatch: 'full'
    },
    {
        path: 'active',
        loadComponent: () => import('./subscriptions-list.component').then(m => m.SubscriptionsListComponent)
    },
    {
        path: 'audit',
        loadComponent: () => import('./subscription-audit.component').then(m => m.SubscriptionAuditComponent)
    }
];
