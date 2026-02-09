import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { TableColumn, TablePagination } from './cerca-table.types';
import { CercaStatusBadgeComponent } from '../../atoms/cerca-status-badge/cerca-status-badge.component';

@Component({
    selector: 'app-cerca-table',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NzTableModule,
        NzInputModule,
        NzButtonModule,
        NzIconModule,
        NzSelectModule,
        NzTooltipModule,
        CercaStatusBadgeComponent
    ],
    templateUrl: './cerca-table.component.html',
    styleUrls: ['./cerca-table.component.scss']
})
export class CercaTableComponent {
    @Input() data: any[] = [];
    @Input() columns: TableColumn[] = [];
    @Input() loading = false;
    @Input() pagination: TablePagination = { pageIndex: 1, pageSize: 10, total: 0 };
    @Input() scrollConfig: { x?: string; y?: string } = { x: '1000px' };

    @Output() filterChange = new EventEmitter<{ key: string; value: any }>();
    @Output() pageChange = new EventEmitter<number>();
    @Output() pageSizeChange = new EventEmitter<number>();

    // Store filter values
    @Input() filterValues: { [key: string]: any } = {};

    onFilter(key: string, value: any) {
        this.filterValues[key] = value;
        this.filterChange.emit({ key, value });
    }

    onPageChange(page: number) {
        this.pageChange.emit(page);
    }

    onPageSizeChange(size: number) {
        this.pageSizeChange.emit(size);
    }

    // Helper to handle actions
    handleAction(action: any, row: any) {
        if (action.callback) {
            action.callback(row);
        }
    }
}
