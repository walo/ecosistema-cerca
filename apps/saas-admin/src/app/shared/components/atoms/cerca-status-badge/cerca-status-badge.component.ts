import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-cerca-status-badge',
    standalone: true,
    imports: [CommonModule],
    template: `
    <span class="cerca-badge" [ngClass]="statusClass">
      <span class="dot"></span>
      {{ label || (status | titlecase) }}
    </span>
  `,
    styles: [`
    .cerca-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      line-height: 1;
      white-space: nowrap;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: currentColor;
    }

    /* Variants */
    .badge-success, .badge-active, .badge-paid {
      background-color: rgba(162, 208, 51, 0.15); /* Lime Green light */
      color: var(--color-success);
    }

    .badge-warning, .badge-pending, .badge-trial {
      background-color: rgba(251, 191, 36, 0.15); /* Amber light */
      color: #d97706; /* Amber 600 */
    }

    .badge-danger, .badge-inactive, .badge-cancelled, .badge-overdue {
      background-color: rgba(239, 68, 68, 0.15); /* Red light */
      color: var(--color-danger);
    }

    .badge-info, .badge-processing {
      background-color: rgba(91, 194, 231, 0.15); /* Cyan light */
      color: var(--color-primary-accent);
    }

    .badge-neutral, .badge-draft {
      background-color: var(--color-slate-100);
      color: var(--color-slate-500);
    }
  `]
})
export class CercaStatusBadgeComponent implements OnChanges {
    @Input() status: string = 'neutral';
    @Input() label: string = '';

    statusClass: string = 'badge-neutral';

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['status']) {
            this.updateStatusClass();
        }
    }

    private updateStatusClass(): void {
        const s = this.status?.toLowerCase() || 'neutral';
        if (['active', 'paid', 'success', 'completed'].includes(s)) {
            this.statusClass = 'badge-success';
        } else if (['pending', 'warning', 'trial', 'waiting'].includes(s)) {
            this.statusClass = 'badge-warning';
        } else if (['inactive', 'cancelled', 'danger', 'failed', 'overdue'].includes(s)) {
            this.statusClass = 'badge-danger';
        } else if (['processing', 'info', 'running'].includes(s)) {
            this.statusClass = 'badge-info';
        } else {
            this.statusClass = 'badge-neutral';
        }
    }
}
