import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SubscriptionHistory {
  id: string;
  client_id: string;
  previous_plan_id: string;
  new_plan_id: string;
  change_type: string;
  created_at: string;
  notes: string;
}

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SectionHeaderComponent } from '../../shared/components/molecules/section-header/section-header.component';
import { CercaCardComponent } from '../../shared/components/atoms/cerca-card/cerca-card.component';
import { CercaStatusBadgeComponent } from '../../shared/components/atoms/cerca-status-badge/cerca-status-badge.component';

@Component({
  selector: 'app-subscription-audit',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    SectionHeaderComponent,
    CercaCardComponent,
    CercaStatusBadgeComponent
  ],
  templateUrl: './subscription-audit.component.html',
  styleUrls: ['./subscription-audit.component.scss']
})
export class SubscriptionAuditComponent implements OnInit {
  private supabase = inject(SupabaseService);
  history = signal<SubscriptionHistory[]>([]);
  displayedColumns: string[] = ['date', 'type', 'notes'];

  ngOnInit() {
    this.loadHistory();
  }

  getBadgeType(type: string): string {
    const t = type.toLowerCase();
    if (t.includes('upgrade')) return 'upgrade';
    if (t.includes('downgrade')) return 'downgrade';
    if (t.includes('billing') || t.includes('payment')) return 'billing';
    return 'other';
  }

  loadHistory() {
    from(this.supabase.client
      .from('subscription_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    ).pipe(
      map(res => res.data || [])
    ).subscribe(data => {
      this.history.set(data as SubscriptionHistory[]);
    });
  }
}
