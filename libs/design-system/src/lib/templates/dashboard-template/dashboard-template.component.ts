import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcGridComponent } from '../../layout/grid/grid.component';
import { CcStackComponent } from '../../layout/stack/stack.component';

@Component({
    selector: 'cc-dashboard-template',
    standalone: true,
    imports: [CommonModule, CcGridComponent, CcStackComponent],
    templateUrl: './dashboard-template.component.html',
    styleUrls: ['./dashboard-template.component.scss']
})
export class CcDashboardTemplateComponent {
    @Input() title: string = 'Escritorio';
    @Input() subtitle?: string;
}
