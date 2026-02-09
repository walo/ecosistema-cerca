import { Component, inject, OnInit, signal, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminSubscriptionService, FeatureDefinition } from '../../../core/services/admin-subscription.service';
import { SectionHeaderComponent, CercaCardComponent } from '../../../shared/components';
import { CercaTableComponent } from '../../../shared/components/organisms/cerca-table/cerca-table.component';
import { TableColumn } from '../../../shared/components/organisms/cerca-table/cerca-table.types';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { FeatureFormComponent } from './feature-form/feature-form.component';

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

    ngOnInit() {
        this.initializeColumns();
        this.loadFeatures();
    }

    initializeColumns() {
        this.tableColumns = [
            {
                key: 'label',
                label: 'Nombre / Etiqueta',
                type: 'text',
                filter: { type: 'text', placeholder: 'Buscar característica...' }
            },
            {
                key: 'key',
                label: 'Clave (Key)',
                type: 'text',
                width: '200px'
            },
            {
                key: 'data_type',
                label: 'Tipo de Dato',
                type: 'template',
                templateRef: this.typeTemplate,
                width: '150px',
                filter: {
                    type: 'select',
                    options: [
                        { label: 'Booleano', value: 'boolean' },
                        { label: 'Numérico', value: 'number' },
                        { label: 'Texto', value: 'text' }
                    ]
                }
            },
            {
                key: 'description',
                label: 'Descripción',
                type: 'text'
            },
            {
                key: 'actions',
                label: '',
                type: 'template',
                templateRef: this.actionsTemplate,
                width: '100px',
                align: 'right'
            }
        ];
    }

    loadFeatures() {
        this.loading.set(true);
        this.adminSubService.getFeatureDefinitions().subscribe({
            next: (data) => {
                this.features.set(data);
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
