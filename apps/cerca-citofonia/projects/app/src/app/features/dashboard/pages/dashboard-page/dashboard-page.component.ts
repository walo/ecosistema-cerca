import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    CcDashboardTemplateComponent,
    CcCardComponent,
    CcStackComponent,
    CcBadgeComponent,
    BadgeVariant,
    CcButtonComponent,
    CcIconComponent
} from '@cerca/design-system';

@Component({
    selector: 'app-dashboard-page',
    standalone: true,
    imports: [
        CommonModule,
        CcDashboardTemplateComponent,
        CcCardComponent,
        CcStackComponent,
        CcBadgeComponent,
        CcButtonComponent,
        CcIconComponent
    ],
    templateUrl: './dashboard-page.component.html',
    styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent {
    metrics: Array<{ label: string, value: string, change: string, type: BadgeVariant, icon: string }> = [
        { label: 'Residentes Activos', value: '1,240', change: '+12%', type: 'success', icon: 'group' },
        { label: 'Visitas Hoy', value: '45', change: '+5%', type: 'info', icon: 'nest_doorbell_visitor' },
        { label: 'Paquetes Pendientes', value: '12', change: '-2%', type: 'warning', icon: 'inventory_2' },
        { label: 'Alertas', value: '2', change: 'Estable', type: 'error', icon: 'warning' }
    ];
}
