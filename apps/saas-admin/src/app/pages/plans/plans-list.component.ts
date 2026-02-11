import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { AdminSubscriptionService, Plan } from '../../core/services/admin-subscription.service';
import { SectionHeaderComponent, CercaCardComponent, CercaStatusBadgeComponent } from '../../shared/components';

import { PlansResource } from './plans.resource';

@Component({
  selector: 'app-plans-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzIconModule,
    NzCardModule,
    NzTagModule,
    NzPopconfirmModule,
    NzGridModule,
    NzSkeletonModule,
    NzEmptyModule,
    NzSpaceModule,
    NzTypographyModule,
    SectionHeaderComponent,
    CercaCardComponent,
    CercaStatusBadgeComponent
  ],
  templateUrl: './plans-list.component.html',
  styleUrl: './plans-list.component.scss'
})
export class PlansListComponent implements OnInit {
  private adminSubService = inject(AdminSubscriptionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  resource = new PlansResource();
  screenData = this.resource.getPantalla('CO');

  plans = signal<Plan[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.loading.set(true);
    this.adminSubService.getPlans().subscribe({
      next: (data) => {
        this.plans.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  deletePlan(id: string) {
    this.adminSubService.deletePlan(id).subscribe({
      next: () => this.loadPlans()
    });
  }

  navigateToNew() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
