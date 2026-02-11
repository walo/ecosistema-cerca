import { Component, inject, OnInit, signal, computed, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSubscriptionService } from '../../core/services/admin-subscription.service';
import { RouterModule } from '@angular/router';
import { InvoicesResource } from './invoices.resource';
import { SectionHeaderComponent, CercaCardComponent, CercaStatusBadgeComponent } from '../../shared/components';
import { CercaTableComponent } from '../../shared/components/organisms/cerca-table/cerca-table.component';
import { TableColumn } from '../../shared/components/organisms/cerca-table/cerca-table.types';

@Component({
  selector: 'app-invoices-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SectionHeaderComponent,
    CercaCardComponent,
    CercaStatusBadgeComponent,
    CercaTableComponent
  ],
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.scss']
})
export class InvoicesListComponent implements OnInit {
  private adminSubService = inject(AdminSubscriptionService);

  @ViewChild('invoiceTemplate', { static: true }) invoiceTemplate!: TemplateRef<any>;
  @ViewChild('clientTemplate', { static: true }) clientTemplate!: TemplateRef<any>;
  @ViewChild('amountTemplate', { static: true }) amountTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;

  invoices = signal<any[]>([]);
  processing = signal(false);
  loading = signal(false);

  // Table Configuration
  tableColumns: TableColumn[] = [];
  filterValues = signal<{ [key: string]: any }>({});

  resource = new InvoicesResource();
  screenData = this.resource.getPantalla('CO');

  ngOnInit() {
    this.initializeColumns();
    this.loadInvoices();
  }

  loadInvoices() {
    this.loading.set(true);
    this.adminSubService.getInvoices().subscribe({
      next: (data) => {
        this.invoices.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  initializeColumns() {
    const resourceColumns = this.resource.getColumns('CO');

    this.tableColumns = resourceColumns.map(col => {
      const tempCol: TableColumn = {
        key: col.col_ref,
        label: col.col_name,
        type: 'text', // Default to text, override below
        width: col.col_width
      };

      if (col.col_ref === 'invoice_number') {
        tempCol.type = 'template';
        tempCol.templateRef = this.invoiceTemplate;
        tempCol.filter = { type: 'text', placeholder: 'Buscar ref...' };
      } else if (col.col_ref === 'client_name') {
        tempCol.type = 'template';
        tempCol.templateRef = this.clientTemplate;
        tempCol.filter = { type: 'text', placeholder: 'Cliente...' };
      } else if (col.col_ref === 'total_amount') {
        tempCol.type = 'template';
        tempCol.templateRef = this.amountTemplate;
        tempCol.sortable = true;
      } else if (col.col_ref === 'due_date') {
        tempCol.type = 'template';
        tempCol.templateRef = this.dateTemplate;
        tempCol.sortable = true;
      } else if (col.col_ref === 'status_id') {
        tempCol.type = 'template';
        tempCol.templateRef = this.statusTemplate;
        tempCol.filter = {
          type: 'select',
          options: [
            { label: 'Exitosas (Paid)', value: 4 },
            { label: 'Pendientes', value: 3 },
            { label: 'Otras', value: 'other' }
          ]
        };
      }

      return tempCol;
    });

    this.tableColumns.push({
      key: 'actions',
      label: 'Controles',
      type: 'template',
      templateRef: this.actionsTemplate,
      align: 'right'
    });
  }

  // Computed filtered invoices
  filteredInvoices = computed(() => {
    const invoices = this.invoices();
    const filters = this.filterValues();

    return invoices.filter(inv => {
      return Object.keys(filters).every(key => {
        const filterVal = filters[key];
        if (!filterVal || filterVal === '' || filterVal === 'all') return true;

        // Custom filtering logic
        if (key === 'status_id') {
          if (filterVal === 'other') {
            return inv.status_id !== 3 && inv.status_id !== 4;
          }
          return String(inv.status_id) == String(filterVal);
        }

        if (key === 'client_name') {
          const clientName = inv.clients?.name || '';
          return clientName.toLowerCase().includes(String(filterVal).toLowerCase());
        }

        // Default generic filtering
        const invVal = inv[key as keyof typeof inv];
        const strVal = String(invVal === null || invVal === undefined ? '' : invVal).toLowerCase();
        const strFilter = String(filterVal).toLowerCase();

        return strVal.includes(strFilter);
      });
    });
  });

  onFilterChange(event: { key: string; value: any }) {
    this.filterValues.update(current => ({
      ...current,
      [event.key]: event.value
    }));
  }

  processBilling() {
    if (confirm('¿Estás seguro de iniciar el proceso de facturación mensual para todos los clientes activos?')) {
      this.processing.set(true);

      // Simulación de ejecución de Edge Function
      this.adminSubService.processMonthlyBilling().subscribe({
        next: (success) => {
          if (success) {
            this.loadInvoices();
          }
          this.processing.set(false);
        },
        error: (err) => {
          console.error('Billing processing error', err);
          this.processing.set(false);
        }
      });
    }
  }

  getStatusVariant(statusId: number): 'success' | 'warning' | 'danger' | 'neutral' {
    // 4: Paid/Success -> active (green)
    // 3: Pending -> warning (amber)
    // Others -> inactive (red)
    if (statusId === 4) return 'success';
    if (statusId === 3) return 'warning';
    return 'danger';
  }
}
