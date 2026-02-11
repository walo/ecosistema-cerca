import { Component, inject, OnInit, signal, computed, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminSubscriptionService, Client } from '../../core/services/admin-subscription.service';
import { ClientsResource } from './clients.resource';
import { SectionHeaderComponent, CercaCardComponent, CercaStatusBadgeComponent } from '../../shared/components';
import { CercaTableComponent } from '../../shared/components/organisms/cerca-table/cerca-table.component';
import { TableColumn } from '../../shared/components/organisms/cerca-table/cerca-table.types';

// Ng-Zorro Imports
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NzPageHeaderModule,
    NzTableModule,
    NzCardModule,
    NzSpaceModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzSelectModule,
    NzTooltipModule,
    SectionHeaderComponent,
    CercaCardComponent,
    CercaTableComponent
  ],
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {
  private subscriptionService = inject(AdminSubscriptionService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  @ViewChild('contactTemplate', { static: true }) contactTemplate!: TemplateRef<any>;

  clients = signal<Client[]>([]);
  loading = signal(true);
  submitting = signal(false);

  // UI State
  showVisible = signal(false);
  isEditing = signal(false);
  activeClientId = signal<string | null>(null);

  // Table Configuration
  tableColumns: TableColumn[] = [];

  resource = new ClientsResource();
  screenData = this.resource.getPantalla('CO');

  ngOnInit() {
    this.initializeColumns();
    this.loadClients();
  }

  loadClients() {
    this.loading.set(true);
    this.subscriptionService.getClients().subscribe({
      next: (data) => {
        this.clients.set(data);
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
        type: 'text',
        width: col.col_width
      };

      if (col.col_ref === 'name') {
        tempCol.filter = { type: 'text', placeholder: 'Buscar...' };
      } else if (col.col_ref === 'contact_name') {
        tempCol.type = 'text';
        // tempCol.templateRef = this.contactTemplate; // Removed as user deleted template from HTML
        tempCol.filter = { type: 'text', placeholder: 'Nombre o Email' };
      } else if (col.col_ref === 'contact_email') {
        tempCol.filter = { type: 'text', placeholder: 'Email...' };
      } else if (col.col_ref === 'contact_phone') {
        tempCol.filter = { type: 'text', placeholder: 'Teléfono...' };
      } else if (col.col_ref === 'status_id') {
        tempCol.type = 'status';
        tempCol.filter = {
          type: 'select',
          options: [
            { label: 'Activa', value: 'Activa' },
            { label: 'Cancelada', value: 'Cancelada' },
            { label: 'Suspendida', value: 'Suspendida' },
            { label: 'En Prueba', value: 'En Prueba' }
          ]
        };
        tempCol.statusMap = {
          7: 'active',
          8: 'inactive',
          9: 'inactive',
          10: 'warning'
        };
      }

      return tempCol;
    });

    this.tableColumns.push({
      key: 'actions',
      label: 'Acciones',
      type: 'actions',
      align: 'right',
      actionConfig: [
        {
          icon: 'edit',
          tooltip: 'Editar',
          callback: (row) => this.editClient(row)
        },
        {
          icon: 'delete',
          tooltip: 'Eliminar',
          danger: true,
          callback: (row) => this.confirmDelete(row)
        }
      ]
    });
  }

  // Helper for contact column template
  getContactInfo(client: Client): string {
    return `${client.contact_name} <br/> <small class="text-xs text-gray-500">${client.contact_email}</small>`;
  }

  // Filter Logic
  filterValues = signal<{ [key: string]: any }>({});

  filteredClients = computed(() => {
    const filters = this.filterValues();
    let data = this.clients();

    if (filters['name']) {
      const q = filters['name'].toLowerCase().trim();
      data = data.filter(c => c.name.toLowerCase().includes(q));
    }

    if (filters['contact_name']) {
      const q = filters['contact_name'].toLowerCase().trim();
      data = data.filter(c =>
        (c.contact_email && c.contact_email.toLowerCase().includes(q)) ||
        (c.contact_name && c.contact_name.toLowerCase().includes(q))
      );
    }

    if (filters['status_id']) {
      const q = filters['status_id']; // The value from select is the label string based on my config
      data = data.filter(c => this.getStatusLabel(c.status_id) === q);
    }

    return data;
  });

  // Form
  clientForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    contact_name: [''],
    contact_email: ['', [Validators.required, Validators.email]],
    contact_phone: [''],
    status_id: [10, Validators.required]
  });



  onTableFilterChange(event: { key: string; value: any }) {
    this.filterValues.update(current => ({ ...current, [event.key]: event.value }));
  }

  openModal() {
    this.isEditing.set(false);
    this.activeClientId.set(null);
    this.clientForm.reset({ status_id: 10 });
    this.showVisible.set(true);
  }

  editClient(client: Client) {
    this.isEditing.set(true);
    this.activeClientId.set(client.id);
    this.clientForm.patchValue({
      name: client.name,
      contact_name: client.contact_name,
      contact_email: client.contact_email,
      contact_phone: client.contact_phone,
      status_id: client.status_id
    });
    this.showVisible.set(true);
  }

  closeModal() {
    this.showVisible.set(false);
  }

  saveClient() {
    if (this.clientForm.invalid) return;

    this.submitting.set(true);
    const clientData = this.clientForm.value;

    if (this.isEditing() && this.activeClientId()) {
      this.subscriptionService.updateClient(this.activeClientId()!, clientData).subscribe({
        next: () => this.handleSuccess(),
        error: () => this.submitting.set(false)
      });
    } else {
      this.subscriptionService.createClient(clientData).subscribe({
        next: () => this.handleSuccess(),
        error: () => this.submitting.set(false)
      });
    }
  }

  confirmDelete(client: Client) {
    if (confirm(`¿Estás seguro de eliminar a ${client.name}? Esta acción no se puede deshacer.`)) {
      this.subscriptionService.deleteClient(client.id).subscribe({
        next: () => this.loadClients()
      });
    }
  }

  private handleSuccess() {
    this.submitting.set(false);
    this.closeModal();
    this.loadClients();
  }

  getStatusLabel(statusId: number): string {
    const labels: Record<number, string> = {
      7: 'Activa',
      8: 'Cancelada',
      9: 'Suspendida',
      10: 'En Prueba'
    };
    return labels[statusId] || 'Desconocido';
  }
}
