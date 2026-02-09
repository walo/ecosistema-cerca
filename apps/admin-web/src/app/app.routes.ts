import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'upgrade',
        loadComponent: () => import('./shared/components/upgrade-prompt/upgrade-prompt.component')
            .then(m => m.UpgradePromptComponent),
        title: 'Mejora tu Plan - Cerca'
    }
];
