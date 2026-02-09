import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminSubscriptionService, Plan, PlanFeature, FeatureDefinition } from '../../core/services/admin-subscription.service';

@Component({
  selector: 'app-plan-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    NzSwitchModule,
    NzCardModule,
    NzGridModule,
    NzDividerModule,
    NzSpaceModule,
    NzInputNumberModule,
    NzPageHeaderModule
  ],
  templateUrl: './plan-form.component.html',
  styleUrl: './plan-form.component.scss'
})
export class PlanFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private adminSubService = inject(AdminSubscriptionService);
  private message = inject(NzMessageService);

  loading = signal(false);
  isEdit = false;
  planId?: string;

  formatterDollar = (value: number): string => (value ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '$ 0');
  parserDollar = (value: string): number => Number(value.replace(/\$\s?|(,*)/g, ''));

  planForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9_]+$/)]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    billing_cycle: [1, Validators.required],
    trial_days: [15, [Validators.required, Validators.min(0)]],
    is_active: [true],
    max_users: [0],
    max_branches: [1],
    max_appointments_per_month: [0],
    features: this.fb.array([])
  });

  featuresList = signal<FeatureDefinition[]>([]);

  get features() {
    return this.planForm.get('features') as FormArray;
  }

  ngOnInit() {
    this.planId = this.route.snapshot.params['id'];
    this.loadAvailableFeatures();
    if (this.planId && this.planId !== 'new') {
      this.isEdit = true;
      this.loadPlan();
    }
  }

  loadAvailableFeatures() {
    this.adminSubService.getFeatureDefinitions().subscribe(defs => {
      this.featuresList.set(defs);
    });
  }

  loadPlan() {
    this.loading.set(true);
    this.adminSubService.getPlans().subscribe(plans => {
      const plan = plans.find(p => p.id === this.planId);
      if (plan) {
        this.planForm.patchValue(plan);
        this.loadFeatures();
      } else {
        this.loading.set(false);
      }
    });
  }

  loadFeatures() {
    if (!this.planId) return;
    this.adminSubService.getPlanFeatures(this.planId).subscribe(features => {
      features.forEach(f => this.addFeature(f));
      this.loading.set(false);
    });
  }

  addFeature(feature?: Partial<PlanFeature>) {
    this.features.push(this.fb.group({
      id: [feature?.id || null],
      key: [feature?.key || '', Validators.required],
      value: [feature?.value || '', Validators.required],
      plan_id: [this.planId || null]
    }));
  }

  getFeatureType(index: number): 'boolean' | 'number' | 'text' {
    const key = this.features.at(index).get('key')?.value;
    const def = this.featuresList().find(f => f.key === key);
    return def?.data_type || 'text';
  }

  removeFeature(index: number) {
    const feature = this.features.at(index).value;
    if (feature.id) {
      if (confirm('¿Eliminar esta característica permanentemente?')) {
        this.adminSubService.deletePlanFeature(feature.id).subscribe();
        this.features.removeAt(index);
      }
    } else {
      this.features.removeAt(index);
    }
  }

  save() {
    if (this.planForm.invalid) return;
    this.loading.set(true);

    const { features, ...planData } = this.planForm.value;

    const obs = this.isEdit
      ? this.adminSubService.updatePlan(this.planId!, planData)
      : this.adminSubService.createPlan(planData);

    obs.subscribe({
      next: (savedPlan) => {
        if (savedPlan) {
          this.saveFeatures(savedPlan.id, features);
        } else {
          this.message.success(this.isEdit ? 'Plan actualizado' : 'Plan creado');
          this.router.navigate(['/plans']);
        }
      },
      error: () => {
        this.loading.set(false);
        this.message.error('Error al guardar el plan');
      }
    });
  }

  private saveFeatures(planId: string, featuresList: any[]) {
    if (featuresList.length === 0) {
      this.message.success(this.isEdit ? 'Plan actualizado' : 'Plan creado');
      this.router.navigate(['/plans']);
      return;
    }

    let completed = 0;
    featuresList.forEach(f => {
      // Ensure value is string
      const featureToSave = {
        ...f,
        plan_id: planId,
        value: String(f.value)
      };

      this.adminSubService.savePlanFeature(featureToSave).subscribe({
        next: () => {
          completed++;
          if (completed === featuresList.length) {
            this.message.success(this.isEdit ? 'Plan actualizado' : 'Plan creado');
            this.router.navigate(['/plans']);
          }
        },
        error: () => {
          completed++;
          if (completed === featuresList.length) {
            this.message.warning('Plan guardado, pero algunas características fallaron');
            this.router.navigate(['/plans']);
          }
        }
      });
    });
  }
}
