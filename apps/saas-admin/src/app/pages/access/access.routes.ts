import { Routes } from '@angular/router';

export const ACCESS_ROUTES: Routes = [
    {
        path: 'permissions',
        loadComponent: () => import('./permissions/permissions-list.component').then(m => m.PermissionsListComponent)
    },
    {
        path: 'users',
        loadComponent: () => import('./users/admin-users-list.component').then(m => m.AdminUsersListComponent)
    }
];
