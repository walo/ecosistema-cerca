import { Routes } from '@angular/router';

export const RESIDENTS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/residents-list/residents-list.component').then(m => m.ResidentsListComponent)
    }
];
