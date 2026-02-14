import { Component, inject, OnInit, signal, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionAuditResource } from './subscription-audit.resource';
import { SectionHeaderComponent, CercaStatusBadgeComponent } from '../../shared/components';
import { CercaTableComponent } from '../../shared/components/organisms/cerca-table/cerca-table.component';
import { TableColumn } from '../../shared/components/organisms/cerca-table/cerca-table.types';
import { SubscriptionService } from '../../core/services/subscription.service';
import { SubscriptionHistory } from '../../core/models/subscription.model';

@Component({
  selector: 'app-subscription-audit',
  standalone: true,
  imports: [
    CommonModule,
    SectionHeaderComponent,
    CercaStatusBadgeComponent,
    CercaTableComponent
  ],
  templateUrl: './subscription-audit.component.html',
  styleUrls: ['./subscription-audit.component.scss']
})
export class SubscriptionAuditComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);

  resource = new SubscriptionAuditResource();
  screenData = this.resource.getPantalla('CO');

  history = signal<SubscriptionHistory[]>([]);
  loading = signal<boolean>(false);

  tableColumns: TableColumn[] = [];

  @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>;
  @ViewChild('typeTemplate', { static: true }) typeTemplate!: TemplateRef<any>;

  ngOnInit() {
    this.initializeColumns();
    this.loadHistory();
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

      if (col.col_ref === 'created_at') {
        tempCol.type = 'template';
        tempCol.templateRef = this.dateTemplate;
      } else if (col.col_ref === 'change_type') {
        tempCol.type = 'template';
        tempCol.templateRef = this.typeTemplate;
      }

      return tempCol;
    });
  }

  loadHistory() {
    this.loading.set(true);
    this.subscriptionService.getSubscriptionHistory().subscribe({
      next: (data) => {
        const mappedData = data.map((item: any) => ({
          ...item,
          client_name: item.client?.name || 'N/A',
          plan_name: item.plan?.name || 'N/A',
          status_name: item.status?.name || 'N/A',
          change_type: item.status?.name || 'N/A'
        }));
        this.history.set(mappedData as any);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getBadgeType(type: number | string): string {
    // If it's a number, map it to a string for badge color logic
    // Or just use generic logic.
    // 1: Created (Success), 2: Upgrade (Success), 3: Downgrade (Warning), 4: Cancel (Error)
    const typeNum = Number(type);
    switch (typeNum) {
      case 1: return 'success'; // Created
      case 2: return 'upgrade'; // Upgrade
      case 3: return 'downgrade'; // Downgrade
      case 4: return 'error'; // Cancelled
      default: return 'neutral';
    }
  }

  getChangeLabel(type: number): string {
    switch (Number(type)) {
      case 1: return 'Creación';
      case 2: return 'Upgrade';
      case 3: return 'Downgrade';
      case 4: return 'Cancelación';
      case 5: return 'Reactivación';
      case 6: return 'Expiración';
      default: return 'Desconocido';
    }
  }
}
