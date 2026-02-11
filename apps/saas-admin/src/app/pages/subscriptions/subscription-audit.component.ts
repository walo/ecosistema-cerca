import { Component, inject, OnInit, signal, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubscriptionAuditResource } from './subscription-audit.resource';
import { SectionHeaderComponent, CercaStatusBadgeComponent } from '../../shared/components';
import { CercaTableComponent } from '../../shared/components/organisms/cerca-table/cerca-table.component';
import { TableColumn } from '../../shared/components/organisms/cerca-table/cerca-table.types';

export interface SubscriptionHistory {
  id: string;
  client_id: string;
  previous_plan_id: string;
  new_plan_id: string;
  change_type: string;
  created_at: string;
  notes: string;
}

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
  private supabase = inject(SupabaseService);

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
    from(this.supabase.client
      .from('subscription_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    ).pipe(
      map(res => res.data || [])
    ).subscribe({
      next: (data) => {
        this.history.set(data as SubscriptionHistory[]);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getBadgeType(type: string): string {
    const t = type.toLowerCase();
    if (t.includes('upgrade')) return 'upgrade';
    if (t.includes('downgrade')) return 'downgrade';
    if (t.includes('billing') || t.includes('payment')) return 'billing';
    return 'neutral';
  }
}
