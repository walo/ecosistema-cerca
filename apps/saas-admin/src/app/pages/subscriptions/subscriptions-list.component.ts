

import { Component, inject, OnInit, signal, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsResource } from './subscriptions.resource';
import { SectionHeaderComponent, CercaStatusBadgeComponent } from '../../shared/components';
import { CercaTableComponent } from '../../shared/components/organisms/cerca-table/cerca-table.component';
import { TableColumn } from '../../shared/components/organisms/cerca-table/cerca-table.types';
import { SubscriptionService } from '../../core/services/subscription.service';
import { Subscription } from '../../core/models/subscription.model';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
    selector: 'app-subscriptions-list',
    standalone: true,
    imports: [
        CommonModule,
        SectionHeaderComponent,
        CercaStatusBadgeComponent,
        CercaTableComponent,
        NzButtonModule,
        NzIconModule,
        NzTooltipModule
    ],
    templateUrl: './subscriptions-list.component.html',
    styleUrls: ['./subscriptions-list.component.scss']
})
export class SubscriptionsListComponent implements OnInit {
    private subscriptionService = inject(SubscriptionService);

    resource = new SubscriptionsResource();
    screenData = this.resource.getPantalla('CO');

    subscriptions = signal<any[]>([]);
    loading = signal<boolean>(false);

    tableColumns: TableColumn[] = [];

    @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
    @ViewChild('priceTemplate', { static: true }) priceTemplate!: TemplateRef<any>;
    @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;

    ngOnInit() {
        this.initializeColumns();
        this.loadSubscriptions();
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

            if (col.col_ref === 'status') {
                tempCol.type = 'template';
                tempCol.templateRef = this.statusTemplate;
            } else if (col.col_ref === 'price') {
                tempCol.type = 'template';
                tempCol.templateRef = this.priceTemplate;
            } else if (col.col_ref === 'start_date') {
                tempCol.type = 'template';
                tempCol.templateRef = this.dateTemplate;
            } else if (col.col_ref === 'actions') {
                tempCol.type = 'template';
                tempCol.templateRef = this.actionsTemplate;
            }

            return tempCol;
        });
    }

    loadSubscriptions() {
        this.loading.set(true);
        this.subscriptionService.getSubscriptions().subscribe({
            next: (data) => {
                const mappedData = data.map(sub => ({
                    ...sub,
                    client: sub.client?.name || 'N/A',
                    plan: sub.plan?.name || 'N/A',
                    billing_cycle: sub.plan?.billing_cycle || 'N/A',
                    price: sub.plan?.price || 0,
                    status: sub.status?.name || 'N/A'
                }));
                this.subscriptions.set(mappedData);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    getBadgeType(status: string): string {
        switch (status) {
            case 'active': return 'success';
            case 'trialing': return 'info';
            case 'past_due': return 'warning';
            case 'canceled': return 'error';
            default: return 'neutral';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'active': return 'Activa';
            case 'trialing': return 'Prueba';
            case 'past_due': return 'Mora';
            case 'canceled': return 'Cancelada';
            default: return status;
        }
    }
}
