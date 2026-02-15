import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { CatalogService } from '../../../../core/services/catalog.service';
import { CatalogCategory, CatalogItem } from '../../../../core/models/catalog.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-item-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NzModalModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzSelectModule,
        NzCheckboxModule,
        NzInputNumberModule
    ],
    template: `
    <form [formGroup]="form" nz-form nzLayout="vertical">
      
      <nz-form-item>
        <nz-form-label [nzSm]="24" [nzXs]="24" nzRequired>Categoría</nz-form-label>
        <nz-form-control [nzSm]="24" [nzXs]="24" nzErrorTip="Seleccione una categoría">
          <nz-select formControlName="category_id" nzPlaceHolder="Seleccionar categoría">
            <nz-option *ngFor="let cat of categories()" [nzValue]="cat.id" [nzLabel]="cat.name"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="24" [nzXs]="24" nzRequired>Nombre</nz-form-label>
        <nz-form-control [nzSm]="24" [nzXs]="24" nzErrorTip="Nombre es obligatorio">
          <input nz-input formControlName="name" />
        </nz-form-control>
      </nz-form-item>

      <div class="grid grid-cols-2 gap-4">
        <nz-form-item>
          <nz-form-label [nzSm]="24" [nzXs]="24" nzRequired>Código</nz-form-label>
          <nz-form-control [nzSm]="24" [nzXs]="24" nzErrorTip="Código es obligatorio">
            <input nz-input formControlName="code" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="24" [nzXs]="24" nzRequired>Orden</nz-form-label>
          <nz-form-control [nzSm]="24" [nzXs]="24">
            <nz-input-number formControlName="sort_order" [nzMin]="0" [nzStep]="1" style="width: 100%"></nz-input-number>
          </nz-form-control>
        </nz-form-item>
      </div>

      <nz-form-item>
        <nz-form-label [nzSm]="24" [nzXs]="24">Descripción</nz-form-label>
        <nz-form-control [nzSm]="24" [nzXs]="24">
          <textarea nz-input formControlName="description" rows="3"></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-control [nzSm]="24" [nzXs]="24">
          <label nz-checkbox formControlName="is_active">Activo</label>
        </nz-form-control>
      </nz-form-item>

      <div *nzModalFooter>
        <button nz-button nzType="default" (click)="destroyModal()">Cancelar</button>
        <button nz-button nzType="primary" (click)="submitForm()" [nzLoading]="loading">Guardar</button>
      </div>
    </form>
  `
})
export class ItemFormComponent implements OnInit {
    @Input() item?: CatalogItem;

    private fb = inject(FormBuilder);
    private modal = inject(NzModalRef);
    private catalogService = inject(CatalogService);
    private message = inject(NzMessageService);

    form!: FormGroup;
    loading = false;
    categories = signal<CatalogCategory[]>([]);

    ngOnInit(): void {
        this.loadCategories();
        this.form = this.fb.group({
            category_id: [this.item?.category_id || null, [Validators.required]],
            name: [this.item?.name || '', [Validators.required]],
            code: [this.item?.code || '', [Validators.required]],
            sort_order: [this.item?.sort_order || 1, [Validators.required]],
            description: [this.item?.description || ''],
            is_active: [this.item?.is_active ?? true]
        });
    }

    loadCategories() {
        this.catalogService.getCategories().subscribe(cats => this.categories.set(cats));
    }

    destroyModal(): void {
        this.modal.destroy();
    }

    submitForm(): void {
        if (this.form.valid) {
            this.loading = true;
            const formValue = this.form.value;

            const request$ = this.item
                ? this.catalogService.updateItem(this.item.id, formValue)
                : this.catalogService.createItem(formValue);

            request$.subscribe({
                next: (res) => {
                    this.loading = false;
                    if (res) {
                        this.message.success('Item guardado correctamente');
                        this.modal.destroy(true);
                    } else {
                        this.message.error('Error al guardar el item');
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
