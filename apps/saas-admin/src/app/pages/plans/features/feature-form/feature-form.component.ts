import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { AdminSubscriptionService, FeatureDefinition } from '../../../../core/services/admin-subscription.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-feature-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule
  ],
  templateUrl: './feature-form.component.html'
})
export class FeatureFormComponent implements OnInit {
  @Input() feature?: FeatureDefinition;

  private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef);
  private adminSubService = inject(AdminSubscriptionService);
  private message = inject(NzMessageService);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private nzModalData = inject<{ feature?: FeatureDefinition }>(NZ_MODAL_DATA, { optional: true });

  form!: FormGroup;
  loading = false;
  isEdit = false;

  ngOnInit() {
    // Fallback for passing data via nzData if @Input isn't automatically bound
    if (!this.feature && this.nzModalData?.feature) {
      this.feature = this.nzModalData.feature;
    }

    this.isEdit = !!this.feature;

    this.form = this.fb.group({
      label: [this.feature?.label || '', [Validators.required]],
      key: [{ value: this.feature?.key || '', disabled: this.isEdit }, [Validators.required, Validators.pattern(/^[a-z0-9_]+$/)]],
      data_type: [this.feature?.data_type || 'boolean', [Validators.required]],
      description: [this.feature?.description || '']
    });
  }

  onLabelChange() {
    if (!this.isEdit && !this.form.get('key')?.touched) {
      const label = this.form.get('label')?.value || '';
      const slug = label
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9]/g, '_') // replace non-alphanumeric with _
        .replace(/_+/g, '_'); // remove duplicate _

      this.form.get('key')?.setValue(slug);
    }
  }

  cancel() {
    this.modalRef.destroy();
  }

  submit() {
    if (this.form.valid) {
      this.loading = true;
      // Get raw value to include disabled 'key' field
      const formData = this.form.getRawValue();

      if (this.isEdit && this.feature) {
        this.adminSubService.updateFeatureDefinition(this.feature.id, formData).subscribe({
          next: (res) => {
            this.loading = false;
            if (res) {
              this.message.success('Característica actualizada');
              this.modalRef.destroy(res);
            }
          },
          error: () => this.loading = false
        });
      } else {
        this.adminSubService.createFeatureDefinition(formData).subscribe({
          next: (res) => {
            this.loading = false;
            if (res) {
              this.message.success('Característica creada');
              this.modalRef.destroy(res);
            }
          },
          error: () => this.loading = false
        });
      }
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
