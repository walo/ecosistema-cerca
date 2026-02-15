import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { BillingService } from '../../../../core/services/billing.service';
import { Coupon, DiscountType } from '../../../../core/models/billing.model';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-coupon-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NzModalModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzSelectModule,
        NzDatePickerModule,
        NzInputNumberModule,
        NzCheckboxModule
    ],
    template: `
    <form [formGroup]="form" nz-form nzLayout="vertical">
      
      <div class="grid grid-cols-2 gap-4">
        <nz-form-item>
          <nz-form-label [nzSm]="24" [nzXs]="24" nzRequired>Código</nz-form-label>
          <nz-form-control [nzSm]="24" [nzXs]="24" nzErrorTip="Código requerido">
            <input nz-input formControlName="code" placeholder="Ej. DESCUENTO20" style="text-transform: uppercase;" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="24" [nzXs]="24" nzRequired>Tipo Descuento</nz-form-label>
          <nz-form-control [nzSm]="24" [nzXs]="24">
            <nz-select formControlName="discount_type">
              <nz-option [nzValue]="1" nzLabel="Porcentaje (%)"></nz-option>
              <nz-option [nzValue]="2" nzLabel="Monto Fijo ($)"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <nz-form-item>
          <nz-form-label [nzSm]="24" [nzXs]="24" nzRequired>Valor Descuento</nz-form-label>
          <nz-form-control [nzSm]="24" [nzXs]="24" nzErrorTip="Valor requerido">
            <nz-input-number formControlName="discount_value" [nzMin]="0" style="width: 100%"></nz-input-number>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="24" [nzXs]="24">Máx. Redenciones</nz-form-label>
          <nz-form-control [nzSm]="24" [nzXs]="24">
            <nz-input-number formControlName="max_redemptions" [nzMin]="1" nzPlaceHolder="Ilimitado" style="width: 100%"></nz-input-number>
          </nz-form-control>
        </nz-form-item>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <nz-form-item>
          <nz-form-label [nzSm]="24" [nzXs]="24" nzRequired>Válido Desde</nz-form-label>
          <nz-form-control [nzSm]="24" [nzXs]="24">
            <nz-date-picker formControlName="valid_from" style="width: 100%"></nz-date-picker>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSm]="24" [nzXs]="24" nzRequired>Válido Hasta</nz-form-label>
          <nz-form-control [nzSm]="24" [nzXs]="24">
            <nz-date-picker formControlName="valid_until" style="width: 100%"></nz-date-picker>
          </nz-form-control>
        </nz-form-item>
      </div>

      <nz-form-item>
        <nz-form-label [nzSm]="24" [nzXs]="24">Descripción</nz-form-label>
        <nz-form-control [nzSm]="24" [nzXs]="24">
          <textarea nz-input formControlName="description" rows="2"></textarea>
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
export class CouponFormComponent implements OnInit {
    @Input() coupon?: Coupon;

    private fb = inject(FormBuilder);
    private modal = inject(NzModalRef);
    private billingService = inject(BillingService);
    private message = inject(NzMessageService);

    form!: FormGroup;
    loading = false;

    ngOnInit(): void {
        this.form = this.fb.group({
            code: [this.coupon?.code || '', [Validators.required]],
            discount_type: [this.coupon?.discount_type || DiscountType.PERCENTAGE, [Validators.required]],
            discount_value: [this.coupon?.discount_value || 0, [Validators.required]],
            max_redemptions: [this.coupon?.max_redemptions || null],
            valid_from: [this.coupon?.valid_from || new Date(), [Validators.required]],
            valid_until: [this.coupon?.valid_until || null, [Validators.required]],
            description: [this.coupon?.description || ''],
            is_active: [this.coupon?.is_active ?? true]
        });
    }

    destroyModal(): void {
        this.modal.destroy();
    }

    submitForm(): void {
        if (this.form.valid) {
            this.loading = true;
            const formValue = this.form.value;
            // Ensure uppercase code
            formValue.code = formValue.code.toUpperCase();

            const request$ = this.coupon
                ? this.billingService.updateCoupon(this.coupon.id, formValue)
                : this.billingService.createCoupon(formValue);

            request$.subscribe({
                next: (res) => {
                    this.loading = false;
                    if (res) {
                        this.message.success('Cupón guardado correctamente');
                        this.modal.destroy(true);
                    } else {
                        this.message.error('Error al guardar el cupón');
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
