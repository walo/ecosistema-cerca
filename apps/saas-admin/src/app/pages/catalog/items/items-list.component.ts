import { Component, inject, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { SectionHeaderComponent, CercaCardComponent } from '../../../shared/components';
import { CercaTableComponent } from '../../../shared/components/organisms/cerca-table/cerca-table.component';
import { TableColumn, TablePagination } from '../../../shared/components/organisms/cerca-table/cerca-table.types';
import { CatalogService } from '../../../core/services/catalog.service';
import { ItemsResource } from './items.resource';
import { CatalogItem } from '../../../core/models/catalog.model';
import { ItemFormComponent } from './item-form/item-form.component';

@Component({
    selector: 'app-items-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        SectionHeaderComponent,
        CercaCardComponent,
        CercaTableComponent,
        NzButtonModule,
        NzIconModule,
        NzModalModule,
        NzTagModule,
        NzSelectModule
    ],
    template: `
    <app-section-header
      [title]="'Ítems de Catálogo'"
      [subtitle]="'Administra los valores individuales del catálogo.'">
      <ng-container actions>
        <button nz-button nzType="primary" (click)="openForm()">
          <span nz-icon nzType="plus"></span>
          Nuevo Ítem
        </button>
      </ng-container>
    </app-section-header>

    <div class="mb-4">
      <nz-select 
        [(ngModel)]="selectedCategory" 
        (ngModelChange)="loadItems()" 
        nzPlaceHolder="Filtrar por categoría" 
        style="width: 250px;">
        <nz-option *ngFor="let cat of categories()" [nzValue]="cat.id" [nzLabel]="cat.name"></nz-option>
        <nz-option [nzValue]="undefined" nzLabel="Todas las categorías"></nz-option>
      </nz-select>
    </div>

    <app-cerca-card>
      <app-cerca-table
        [columns]="tableColumns"
        [data]="items()"
        [loading]="loading()"
        [pagination]="pagination()"
        (pageChange)="onPageChange($event)">
      </app-cerca-table>
    </app-cerca-card>

    <ng-template #actionsTemplate let-data>
      <button nz-button nzType="text" nzShape="circle" (click)="openForm(data)">
        <span nz-icon nzType="edit" nzTheme="outline" class="text-blue-600"></span>
      </button>
      <button nz-button nzType="text" nzShape="circle" nzDanger (click)="deleteItem(data)">
        <span nz-icon nzType="delete" nzTheme="outline"></span>
      </button>
    </ng-template>

    <ng-template #activeTemplate let-item>
      <nz-tag [nzColor]="item.is_active ? 'success' : 'error'">{{ item.is_active ? 'Activo' : 'Inactivo' }}</nz-tag>
    </ng-template>
  `
})
export class ItemsListComponent implements OnInit {
    private catalogService = inject(CatalogService);
    private modal = inject(NzModalService);
    private message = inject(NzMessageService);
    private resource = new ItemsResource();

    @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;
    @ViewChild('activeTemplate', { static: true }) activeTemplate!: TemplateRef<any>;

    items = signal<CatalogItem[]>([]);
    categories = signal<any[]>([]); // Simplified for dropdown
    selectedCategory?: number;
    loading = signal(false);
    pagination = signal<TablePagination>({ pageIndex: 1, pageSize: 10, total: 0 });
    tableColumns: TableColumn[] = [];

    ngOnInit(): void {
        this.initializeColumns();
        this.loadCategories();
        this.loadItems();
    }

    initializeColumns(): void {
        const resourceColumns = this.resource.getColumns('CO');
        this.tableColumns = resourceColumns.map(col => {
            const tempCol: TableColumn = {
                key: col.col_ref,
                label: col.col_name,
                type: 'text',
                width: col.col_width
            };

            if (col.col_ref === 'is_active') {
                tempCol.type = 'template';
                tempCol.templateRef = this.activeTemplate;
            }

            return tempCol;
        });

        this.tableColumns.push({
            key: 'actions',
            label: '',
            type: 'template',
            templateRef: this.actionsTemplate,
            width: '100px',
            align: 'right'
        });
    }

    loadCategories() {
        this.catalogService.getCategories().subscribe(data => this.categories.set(data));
    }

    loadItems(): void {
        this.loading.set(true);
        this.catalogService.getItems(this.selectedCategory).subscribe({
            next: (data) => {
                this.items.set(data);
                this.pagination.update(p => ({ ...p, total: data.length }));
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    onPageChange(pageIndex: number): void {
        this.pagination.update(p => ({ ...p, pageIndex }));
    }

    openForm(item?: CatalogItem): void {
        const modal = this.modal.create({
            nzTitle: item ? 'Editar Ítem' : 'Nuevo Ítem',
            nzContent: ItemFormComponent,
            nzData: { item },
            nzFooter: null,
            nzWidth: 600
        });

        modal.afterClose.subscribe(result => {
            if (result) {
                this.loadItems();
            }
        });
    }

    deleteItem(item: CatalogItem): void {
        this.modal.confirm({
            nzTitle: '¿Eliminar ítem?',
            nzContent: `Estás a punto de eliminar "${item.name}".`,
            nzOkText: 'Eliminar',
            nzOkDanger: true,
            nzOnOk: () => {
                this.catalogService.deleteItem(item.id).subscribe({
                    next: (success) => {
                        if (success) {
                            this.message.success('Ítem eliminado');
                            this.loadItems();
                        } else {
                            this.message.error('No se pudo eliminar');
                        }
                    }
                });
            }
        });
    }
}
