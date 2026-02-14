import { Component, inject, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SectionHeaderComponent, CercaCardComponent } from '../../../shared/components';
import { CercaTableComponent } from '../../../shared/components/organisms/cerca-table/cerca-table.component';
import { TableColumn, TablePagination } from '../../../shared/components/organisms/cerca-table/cerca-table.types';
import { CatalogService } from '../../../core/services/catalog.service';
import { CategoriesResource } from './categories.resource';
import { CatalogCategory } from '../../../core/models/catalog.model';
import { CategoryFormComponent } from './category-form/category-form.component';

@Component({
    selector: 'app-categories-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        SectionHeaderComponent,
        CercaCardComponent,
        CercaTableComponent,
        NzButtonModule,
        NzIconModule,
        NzModalModule
    ],
    template: `
    <app-section-header
      [title]="'Categorías de Catálogo'"
      [subtitle]="'Organiza los ítems del catálogo.'">
      <ng-container actions>
        <button nz-button nzType="primary" (click)="openForm()">
          <span nz-icon nzType="plus"></span>
          Nueva Categoría
        </button>
      </ng-container>
    </app-section-header>

    <app-cerca-card>
      <app-cerca-table
        [columns]="tableColumns"
        [data]="categories()"
        [loading]="loading()"
        [pagination]="pagination()"
        (pageChange)="onPageChange($event)">
      </app-cerca-table>
    </app-cerca-card>

    <ng-template #actionsTemplate let-data="data">
      <button nz-button nzType="text" nzShape="circle" (click)="openForm(data)">
        <span nz-icon nzType="edit" nzTheme="outline" class="text-blue-600"></span>
      </button>
      <button nz-button nzType="text" nzShape="circle" nzDanger (click)="deleteCategory(data)">
        <span nz-icon nzType="delete" nzTheme="outline"></span>
      </button>
    </ng-template>
  `
})
export class CategoriesListComponent implements OnInit {
    private catalogService = inject(CatalogService);
    private modal = inject(NzModalService);
    private message = inject(NzMessageService);
    private resource = new CategoriesResource();

    @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;

    categories = signal<CatalogCategory[]>([]);
    loading = signal(false);
    pagination = signal<TablePagination>({ pageIndex: 1, pageSize: 10, total: 0 });
    tableColumns: TableColumn[] = [];

    ngOnInit(): void {
        this.initializeColumns();
        this.loadCategories();
    }

    initializeColumns(): void {
        const resourceColumns = this.resource.getColumns('CO');
        this.tableColumns = resourceColumns.map(col => ({
            key: col.col_ref,
            label: col.col_name,
            type: 'text',
            width: col.col_width
        }));

        this.tableColumns.push({
            key: 'actions',
            label: '',
            type: 'template',
            templateRef: this.actionsTemplate,
            width: '100px',
            align: 'right'
        });
    }

    loadCategories(): void {
        this.loading.set(true);
        this.catalogService.getCategories().subscribe({
            next: (data) => {
                this.categories.set(data);
                this.pagination.update(p => ({ ...p, total: data.length }));
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    onPageChange(pageIndex: number): void {
        this.pagination.update(p => ({ ...p, pageIndex }));
    }

    openForm(category?: CatalogCategory): void {
        const modal = this.modal.create({
            nzTitle: category ? 'Editar Categoría' : 'Nueva Categoría',
            nzContent: CategoryFormComponent,
            nzData: { category },
            nzFooter: null,
            nzWidth: 600
        });

        modal.afterClose.subscribe(result => {
            if (result) {
                this.loadCategories();
            }
        });
    }

    deleteCategory(category: CatalogCategory): void {
        this.modal.confirm({
            nzTitle: '¿Eliminar categoría?',
            nzContent: `Estás a punto de eliminar "${category.name}".`,
            nzOkText: 'Eliminar',
            nzOkDanger: true,
            nzOnOk: () => {
                this.catalogService.deleteCategory(category.id).subscribe({
                    next: (success) => {
                        if (success) {
                            this.message.success('Categoría eliminada');
                            this.loadCategories();
                        } else {
                            this.message.error('No se pudo eliminar');
                        }
                    }
                });
            }
        });
    }
}
