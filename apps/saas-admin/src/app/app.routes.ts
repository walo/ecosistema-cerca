import { Routes } from '@angular/router';
import { superAdminGuard } from './core/guards/super-admin.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent)
    },
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
        canActivate: [superAdminGuard],

        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'plans',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./pages/plans/plans-list.component').then(m => m.PlansListComponent)
                    },
                    {
                        path: 'features',
                        loadComponent: () => import('./pages/plans/features/features-list.component').then(m => m.FeaturesListComponent)
                    },
                    {
                        path: 'new',
                        loadComponent: () => import('./pages/plans/plan-form.component').then(m => m.PlanFormComponent)
                    },
                    { path: ':id/edit', loadComponent: () => import('./pages/plans/plan-form.component').then(m => m.PlanFormComponent) }
                ]
            },
            {
                path: 'clients',
                loadComponent: () => import('./pages/clients/clients-list.component').then(m => m.ClientsListComponent)
            },
            {
                path: 'audit',
                loadComponent: () => import('./pages/subscriptions/subscription-audit.component').then(m => m.SubscriptionAuditComponent)
            },
            {
                path: 'billing',
                loadComponent: () => import('./pages/billing/invoices-list.component').then(m => m.InvoicesListComponent)
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'auth' }
];

