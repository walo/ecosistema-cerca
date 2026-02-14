import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CatalogService } from '../../../../core/services/catalog.service';
import { CatalogCategory } from '../../../../core/models/catalog.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-category-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NzModalModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule
    ],
    template: `
    <form [formGroup]="form" nz-form nzLayout="vertical">
      <nz-form-item>
        <nz-form-label [nzSm]="24" [nzXs]="24" nzRequired>Nombre</nz-form-label>
        <nz-form-control [nzSm]="24" [nzXs]="24" nzErrorTip="Por favor ingrese el nombre">
          <input nz-input formControlName="name" placeholder="Ej. Tipos de Inmueble" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="24" [nzXs]="24" nzRequired>Código</nz-form-label>
        <nz-form-control [nzSm]="24" [nzXs]="24" nzErrorTip="Por favor ingrese el código único">
          <input nz-input formControlName="code" placeholder="Ej. PROPERTY_TYPES" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="24" [nzXs]="24">Descripción</nz-form-label>
        <nz-form-control [nzSm]="24" [nzXs]="24">
          <textarea nz-input formControlName="description" rows="3" placeholder="Descripción opcional..."></textarea>
        </nz-form-control>
      </nz-form-item>

      <div *nzModalFooter>
        <button nz-button nzType="default" (click)="destroyModal()">Cancelar</button>
        <button nz-button nzType="primary" (click)="submitForm()" [nzLoading]="loading">Guardar</button>
      </div>
    </form>
  `
})
export class CategoryFormComponent implements OnInit {
    @Input() category?: CatalogCategory;

    private fb = inject(FormBuilder);
    private modal = inject(NzModalRef);
    private catalogService = inject(CatalogService);
    private message = inject(NzMessageService);

    form!: FormGroup;
    loading = false;

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [this.category?.name || '', [Validators.required]],
            code: [this.category?.code || '', [Validators.required]],
            description: [this.category?.description || '']
        });
    }

    destroyModal(): void {
        this.modal.destroy();
    }

    submitForm(): void {
        if (this.form.valid) {
            this.loading = true;
            const formValue = this.form.value;

            const request$ = this.category
                ? this.catalogService.updateCategory(this.category.id, formValue)
                : this.catalogService.createCategory(formValue);

            request$.subscribe({
                next: (res) => {
                    this.loading = false;
                    if (res) {
                        this.message.success('Categoría guardada correctamente');
                        this.modal.destroy(true);
                    } else {
                        this.message.error('Error al guardar la categoría');
                    }
                },
                error: () => {
                    this.loading = false;
                    this.message.error('Error al procesar la solicitud');
                }
            });
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
