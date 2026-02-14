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
                path: 'subscriptions',
                loadChildren: () => import('./pages/subscriptions/subscriptions.routes').then(m => m.SUBSCRIPTION_ROUTES)
            },
            {
                path: 'billing',
                loadChildren: () => import('./pages/billing/billing.routes').then(m => m.BILLING_ROUTES)
            },
            {
                path: 'catalog',
                loadChildren: () => import('./pages/catalog/catalog.routes').then(m => m.CATALOG_ROUTES)
            },
            {
                path: 'access',
                loadChildren: () => import('./pages/access/access.routes').then(m => m.ACCESS_ROUTES)
            },
            {
                path: 'settings',
                loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
            },
            {
                path: 'dummy',
                loadComponent: () => import('./pages/dummy/dummy-table.component').then(m => m.DummyTableComponent)
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '**', redirectTo: 'auth' }
];

