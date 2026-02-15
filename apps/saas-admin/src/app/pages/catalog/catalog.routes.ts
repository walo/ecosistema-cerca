import { Routes } from '@angular/router';
import { CategoriesListComponent } from './categories/categories-list.component';
import { ItemsListComponent } from './items/items-list.component';

export const CATALOG_ROUTES: Routes = [
    {
        path: 'categories',
        component: CategoriesListComponent
    },
    {
        path: 'items',
        component: ItemsListComponent
    },
    {
        path: '',
        redirectTo: 'categories',
        pathMatch: 'full'
    }
];
