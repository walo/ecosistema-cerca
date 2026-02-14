import { Routes } from '@angular/router';

export const BILLING_ROUTES: Routes = [
    {
        path: 'invoices',
        loadComponent: () => import('./invoices-list.component').then(m => m.InvoicesListComponent)
    },
    {
        path: 'coupons',
        loadComponent: () => import('./coupons/coupons-list.component').then(m => m.CouponsListComponent)
    },
    {
        path: '',
        redirectTo: 'invoices',
        pathMatch: 'full'
    }
];
