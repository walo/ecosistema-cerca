import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    CcDataTableComponent,
    CcButtonComponent,
    CcBadgeComponent,
    CcSearchBarComponent,
    CcInlineComponent,
    CcCardComponent,
    CcStackComponent
} from '@cerca/design-system';

@Component({
    selector: 'app-residents-list',
    standalone: true,
    imports: [
        CommonModule,
        CcDataTableComponent,
        CcButtonComponent,
        CcBadgeComponent,
        CcSearchBarComponent,
        CcInlineComponent,
        CcCardComponent,
        CcStackComponent
    ],
    templateUrl: './residents-list.component.html'
})
export class ResidentsListComponent {
    columns = [
        { key: 'unit', label: 'Unidad/Apto' },
        { key: 'name', label: 'Nombre Completo' },
        { key: 'type', label: 'Tipo' },
        { key: 'status', label: 'Estado' }
    ];

    data = [
        { id: 1, unit: '101', name: 'Juan Perez', type: 'Propietario', status: 'Activo' },
        { id: 2, unit: '102', name: 'Maria Lopez', type: 'Arrendatario', status: 'Inactivo' },
        { id: 3, unit: '201', name: 'Carlos Ruiz', type: 'Propietario', status: 'Activo' }
    ];
}
