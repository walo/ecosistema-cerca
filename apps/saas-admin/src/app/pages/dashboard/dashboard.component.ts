import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSubscriptionService } from '../../core/services/admin-subscription.service';

import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';

import { SectionHeaderComponent } from '../../shared/components/molecules/section-header/section-header.component';
import { CercaCardComponent } from '../../shared/components/atoms/cerca-card/cerca-card.component';
import { CercaStatusBadgeComponent } from '../../shared/components/atoms/cerca-status-badge/cerca-status-badge.component';

@Component({
   selector: 'app-dashboard',
   standalone: true,
   imports: [
      CommonModule,
      NzGridModule,
      NzSkeletonModule,
      NzIconModule,
      NzTypographyModule,
      NzSpaceModule,
      NzButtonModule,
      NzTimelineModule,
      SectionHeaderComponent,
      CercaCardComponent,
      CercaStatusBadgeComponent
   ],
   templateUrl: './dashboard.component.html',
   styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
   private adminService = inject(AdminSubscriptionService);

   loading = signal(true);
   stats = signal({
      mrr: 0,
      clients: 0,
      pendingInvoices: 0,
   });

   async ngOnInit() {
      const [mrr, clients, pendingInvoices] = await Promise.all([
         this.adminService.getMRR(),
         this.adminService.getClientsCount(),
         this.adminService.getPendingInvoicesCount(),
      ]);
      this.stats.set({ mrr, clients, pendingInvoices });
      this.loading.set(false);
   }
}
