import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalRef } from 'ng-zorro-antd/modal';
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
    template: `
    <form [formGroup]="form" nz-form nzLayout="vertical">
      <nz-form-item>
        <nz-form-label nzRequired>Nombre (Etiqueta)</nz-form-label>
        <nz-form-control nzErrorTip="Por favor ingrese el nombre">
          <input nz-input formControlName="label" placeholder="ej. Usuarios Máximos" (input)="onLabelChange()" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzRequired nzTooltipTitle="Identificador único para uso interno">Clave (Key)</nz-form-label>
        <nz-form-control nzErrorTip="Por favor ingrese una clave única">
          <input nz-input formControlName="key" placeholder="ej. max_users" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzRequired>Tipo de Dato</nz-form-label>
        <nz-form-control>
          <nz-select formControlName="data_type">
            <nz-option nzValue="boolean" nzLabel="Booleano (Sí/No)"></nz-option>
            <nz-option nzValue="number" nzLabel="Numérico"></nz-option>
            <nz-option nzValue="text" nzLabel="Texto"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label>Descripción</nz-form-label>
        <nz-form-control>
          <textarea nz-input formControlName="description" rows="3" placeholder="Descripción para el usuario final..."></textarea>
        </nz-form-control>
      </nz-form-item>

      <div class="flex justify-end gap-2 mt-4">
        <button nz-button (click)="cancel()">Cancelar</button>
        <button nz-button nzType="primary" [nzLoading]="loading" (click)="submit()">
          {{ isEdit ? 'Actualizar' : 'Crear' }}
        </button>
      </div>
    </form>
  `
})
export class FeatureFormComponent implements OnInit {
    @Input() feature?: FeatureDefinition;

    private fb = inject(FormBuilder);
    private modalRef = inject(NzModalRef);
    private adminSubService = inject(AdminSubscriptionService);
    private message = inject(NzMessageService);

    form!: FormGroup;
    loading = false;
    isEdit = false;

    ngOnInit() {
        this.isEdit = !!this.feature;
        this.form = this.fb.group({
            label: [this.feature?.label || '', [Validators.required]],
            key: [this.feature?.key || '', [Validators.required, Validators.pattern(/^[a-z0-9_]+$/)]],
            data_type: [this.feature?.data_type || 'boolean', [Validators.required]],
            description: [this.feature?.description || '']
        });

        if (this.isEdit) {
            this.form.get('key')?.disable(); // Prevent changing key regarding consistency
        }
    }

    onLabelChange() {
        if (!this.isEdit && !this.form.get('key')?.dirty) {
            const label = this.form.get('label')?.value;
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
            Object.keys(this.form.controls).forEach(key => {
                this.form.get(key)?.markAsDirty();
                this.form.get(key)?.updateValueAndValidity();
            });
        }
    }
}
