import { Component, inject, OnInit, signal, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminSubscriptionService, FeatureDefinition } from '../../../core/services/admin-subscription.service';
import { SectionHeaderComponent, CercaCardComponent } from '../../../shared/components';
import { CercaTableComponent } from '../../../shared/components/organisms/cerca-table/cerca-table.component';
import { TableColumn, TablePagination } from '../../../shared/components/organisms/cerca-table/cerca-table.types';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { FeatureFormComponent } from './feature-form/feature-form.component';
import { FeaturesResource } from './features.resource';

@Component({
    selector: 'app-features-list',
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
    templateUrl: './features-list.component.html',
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class FeaturesListComponent implements OnInit {
    private adminSubService = inject(AdminSubscriptionService);
    private message = inject(NzMessageService);
    private modal = inject(NzModalService);

    @ViewChild('typeTemplate', { static: true }) typeTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;

    features = signal<FeatureDefinition[]>([]);
    loading = signal(false);
    tableColumns: TableColumn[] = [];

    private resource = new FeaturesResource(); // Instantiate resource

    pagination = signal<TablePagination>({ pageIndex: 1, pageSize: 5, total: 0 });
    filters: { [key: string]: any } = {};

    ngOnInit() {
        this.initializeColumns();
        this.loadFeatures();
    }

    initializeColumns() {
        const resourceColumns = this.resource.getColumns('CO');

        this.tableColumns = resourceColumns.map(col => {
            const tempCol: TableColumn = {
                key: col.col_ref,
                label: col.col_name,
                type: 'text',
                width: col.col_width
            };

            // Custom mappings based on key
            if (col.col_ref === 'label') {
                tempCol.filter = { type: 'text', placeholder: 'Buscar característica...' };
            } else if (col.col_ref === 'data_type') {
                tempCol.type = 'template';
                tempCol.templateRef = this.typeTemplate;
                tempCol.filter = {
                    type: 'select',
                    options: [
                        { label: 'Booleano', value: 'boolean' },
                        { label: 'Numérico', value: 'number' },
                        { label: 'Texto', value: 'text' }
                    ]
                };
            }

            return tempCol;
        });

        // Add Actions column manually as it's not data-driven usually, or could be in resource too
        this.tableColumns.push({
            key: 'actions',
            label: '',
            type: 'template',
            templateRef: this.actionsTemplate,
            width: '100px',
            align: 'right'
        });
    }


    onFilterChange(event: { key: string; value: any }) {
        this.filters[event.key] = event.value;
        this.pagination.update(curr => ({ ...curr, pageIndex: 1 }));
        this.loadFeatures();
    }

    loadFeatures() {
        this.loading.set(true);
        console.log(this.filters);
        this.adminSubService.getFeatureDefinitions(this.filters).subscribe({
            next: (data) => {
                this.features.set(data);
                this.pagination.update(curr => ({ ...curr, total: data.length }));
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    openForm(feature?: FeatureDefinition) {
        const modal = this.modal.create({
            nzTitle: feature ? 'Editar Característica' : 'Nueva Característica',
            nzContent: FeatureFormComponent,
            nzData: { feature },
            nzFooter: null,
            nzWidth: 600
        });

        modal.afterClose.subscribe(result => {
            if (result) {
                this.loadFeatures();
            }
        });
    }

    deleteFeature(feature: FeatureDefinition) {
        this.modal.confirm({
            nzTitle: '¿Eliminar característica?',
            nzContent: `Estás a punto de eliminar "${feature.label}". Esto podría afectar a los planes que la utilicen.`,
            nzOkText: 'Eliminar',
            nzOkDanger: true,
            nzOnOk: () => {
                this.adminSubService.deleteFeatureDefinition(feature.id).subscribe({
                    next: (success) => {
                        if (success) {
                            this.message.success('Característica eliminada');
                            this.loadFeatures();
                        } else {
                            this.message.error('No se pudo eliminar');
                        }
                    }
                });
            }
        });
    }
}
