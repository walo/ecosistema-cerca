import { Component, inject, OnInit, signal, computed, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminSubscriptionService, Client, Plan } from '../../core/services/admin-subscription.service';
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
import { NzMessageService } from 'ng-zorro-antd/message';

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
  private message = inject(NzMessageService);

  @ViewChild('contactTemplate', { static: true }) contactTemplate!: TemplateRef<any>;

  clients = signal<Client[]>([]);
  loading = signal(true);
  submitting = signal(false);

  // UI State
  showVisible = signal(false);
  isEditing = signal(false);
  showPlanModal = signal(false);
  activeClientId = signal<string | null>(null);

  // Plans Data
  plans = signal<Plan[]>([]);
  selectedPlanId = signal<string | null>(null);

  // Table Configuration
  tableColumns: TableColumn[] = [];

  resource = new ClientsResource();
  screenData = this.resource.getPantalla('CO');

  ngOnInit() {
    this.initializeColumns();
    this.loadClients();
    this.loadPlans();
  }

  loadPlans() {
    this.subscriptionService.getPlans().subscribe(data => this.plans.set(data));
  }

  loadClients() {
    this.loading.set(true);
    this.subscriptionService.getClients().subscribe({
      next: (data) => {
        const mappedData = data.map(client => ({
          ...client,
          current_plan: client.active_subscription?.[0]?.plan?.name || 'Sin Plan',
          subscription_status: client.active_subscription?.[0]?.status?.name || 'Sin Suscripción'
        }));
        this.clients.set(mappedData);
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
        },
        {
          icon: 'schedule',
          tooltip: 'Asignar Plan',
          callback: (row) => this.openAssignPlanModal(row)
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



  onTableFilterChange(event: { key: string; value: string | number | null }) {
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

  // --- Plan Assignment Logic ---

  openAssignPlanModal(client: Client) {
    this.activeClientId.set(client.id);
    this.selectedPlanId.set(null);
    this.showPlanModal.set(true);
  }

  closePlanModal() {
    this.showPlanModal.set(false);
    this.selectedPlanId.set(null);
  }

  saveSubscription() {
    if (!this.activeClientId() || !this.selectedPlanId()) return;

    this.submitting.set(true);
    this.subscriptionService.assignSubscription(this.activeClientId()!, this.selectedPlanId()!)
      .subscribe({
        next: () => {
          this.message.success('Plan asignado correctamente');
          this.submitting.set(false);
          this.closePlanModal();
        },
        error: (err) => {
          console.error(err);
          this.message.error('Error al asignar el plan');
          this.submitting.set(false);
        }
      });
  }
}
