import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcIconComponent } from '../../atoms/icons/icon.component';
import { CcButtonComponent } from '../../atoms/button/button.component';
import { CcSearchBarComponent } from '../../molecules/search-bar/search-bar.component';

export interface TableColumn {
    key: string;
    label: string;
    type?: 'text' | 'number' | 'date' | 'badge' | 'custom';
    sortable?: boolean;
}

@Component({
    selector: 'cc-data-table',
    standalone: true,
    imports: [CommonModule, CcIconComponent, CcSearchBarComponent],
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.scss']
})
export class CcDataTableComponent {
    @Input() data: any[] = [];
    @Input() columns: TableColumn[] = [];
    @Input() loading: boolean = false;
    @Input() showSearch: boolean = true;
    @Input() searchPlaceholder: string = 'Buscar en la tabla...';

    @Output() rowClick = new EventEmitter<any>();
    @Output() search = new EventEmitter<string>();
    @Output() actionClick = new EventEmitter<{ action: string, row: any }>();

    @ContentChild('customCell') customCellTemplate?: TemplateRef<any>;
    @ContentChild('rowActions') rowActionsTemplate?: TemplateRef<any>; // Fixed missing ContentChild

    get skeletonRows() {
        return Array(5).fill(0);
    }
}
