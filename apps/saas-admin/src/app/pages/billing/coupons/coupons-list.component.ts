import { Component, inject, OnInit, signal, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { SectionHeaderComponent, CercaCardComponent } from '../../../shared/components';
import { CercaTableComponent } from '../../../shared/components/organisms/cerca-table/cerca-table.component';
import { TableColumn, TablePagination } from '../../../shared/components/organisms/cerca-table/cerca-table.types';
import { BillingService } from '../../../core/services/billing.service';
import { CouponsResource } from './coupons.resource';
import { Coupon, DiscountType } from '../../../core/models/billing.model';
import { CouponFormComponent } from './coupon-form/coupon-form.component';

@Component({
    selector: 'app-coupons-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        SectionHeaderComponent,
        CercaCardComponent,
        CercaTableComponent,
        NzButtonModule,
        NzIconModule,
        NzModalModule,
        NzTagModule
    ],
    template: `
    <app-section-header
      [title]="'Cupones de Descuento'"
      [subtitle]="'Administra los códigos promocionales y sus reglas.'">
      <ng-container actions>
        <button nz-button nzType="primary" (click)="openForm()">
          <span nz-icon nzType="plus"></span>
          Nuevo Cupón
        </button>
      </ng-container>
    </app-section-header>

    <app-cerca-card>
      <app-cerca-table
        [columns]="tableColumns"
        [data]="coupons()"
        [loading]="loading()"
        [pagination]="pagination()"
        (pageChange)="onPageChange($event)">
      </app-cerca-table>
    </app-cerca-card>

    <ng-template #actionsTemplate let-data>
      <button nz-button nzType="text" nzShape="circle" (click)="openForm(data)">
        <span nz-icon nzType="edit" nzTheme="outline" class="text-blue-600"></span>
      </button>
      <button nz-button nzType="text" nzShape="circle" nzDanger (click)="deleteCoupon(data)">
        <span nz-icon nzType="delete" nzTheme="outline"></span>
      </button>
    </ng-template>

    <ng-template #typeTemplate let-item>
      <nz-tag [nzColor]="item.discount_type === 1 ? 'blue' : 'green'">
        {{ item.discount_type === 1 ? 'Porcentaje' : 'Monto Fijo' }}
      </nz-tag>
    </ng-template>

    <ng-template #valueTemplate let-item>
        <span *ngIf="item.discount_type === 1">{{ item.discount_value }}%</span>
        <span *ngIf="item.discount_type === 2">{{ item.discount_value | currency }}</span>
    </ng-template>

    <ng-template #activeTemplate let-item>
      <nz-tag [nzColor]="item.is_active ? 'success' : 'error'">{{ item.is_active ? 'Activo' : 'Inactivo' }}</nz-tag>
    </ng-template>

    <ng-template #validFromTemplate let-item>
        {{ item.valid_from | date:'shortDate' }}
    </ng-template>

    <ng-template #validUntilTemplate let-item>
        {{ item.valid_until | date:'shortDate' }}
    </ng-template>
  `
})
export class CouponsListComponent implements OnInit {
    private billingService = inject(BillingService);
    private modal = inject(NzModalService);
    private message = inject(NzMessageService);
    private resource = new CouponsResource();

    @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;
    @ViewChild('typeTemplate', { static: true }) typeTemplate!: TemplateRef<any>;
    @ViewChild('valueTemplate', { static: true }) valueTemplate!: TemplateRef<any>;
    @ViewChild('activeTemplate', { static: true }) activeTemplate!: TemplateRef<any>;
    @ViewChild('validFromTemplate', { static: true }) validFromTemplate!: TemplateRef<any>;
    @ViewChild('validUntilTemplate', { static: true }) validUntilTemplate!: TemplateRef<any>;

    coupons = signal<Coupon[]>([]);
    loading = signal(false);
    pagination = signal<TablePagination>({ pageIndex: 1, pageSize: 10, total: 0 });
    tableColumns: TableColumn[] = [];

    ngOnInit(): void {
        this.initializeColumns();
        this.loadCoupons();
    }

    initializeColumns(): void {
        const resourceColumns = this.resource.getColumns('CO');
        this.tableColumns = resourceColumns.map(col => {
            const tempCol: TableColumn = {
                key: col.col_ref,
                label: col.col_name,
                type: 'text',
                width: col.col_width
            };

            if (col.col_ref === 'discount_type') {
                tempCol.templateRef = this.typeTemplate;
            } else if (col.col_ref === 'discount_value') {
                tempCol.templateRef = this.valueTemplate;
            } else if (col.col_ref === 'is_active') {
                tempCol.templateRef = this.activeTemplate;
            } else if (col.col_ref === 'valid_from') {
                tempCol.templateRef = this.validFromTemplate;
            } else if (col.col_ref === 'valid_until') {
                tempCol.templateRef = this.validUntilTemplate;
            }

            return tempCol;
        });

        this.tableColumns.push({
            key: 'actions',
            label: '',
            type: 'template',
            templateRef: this.actionsTemplate,
            width: '100px',
            align: 'right'
        });
    }

    loadCoupons(): void {
        this.loading.set(true);
        this.billingService.getCoupons().subscribe({
            next: (data) => {
                this.coupons.set(data);
                this.pagination.update(p => ({ ...p, total: data.length }));
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    onPageChange(pageIndex: number): void {
        this.pagination.update(p => ({ ...p, pageIndex }));
    }

    openForm(coupon?: Coupon): void {
        const modal = this.modal.create({
            nzTitle: coupon ? 'Editar Cupón' : 'Nuevo Cupón',
            nzContent: CouponFormComponent,
            nzData: { coupon },
            nzFooter: null,
            nzWidth: 600
        });

        modal.afterClose.subscribe(result => {
            if (result) {
                this.loadCoupons();
            }
        });
    }

    deleteCoupon(coupon: Coupon): void {
        this.modal.confirm({
            nzTitle: '¿Eliminar cupón?',
            nzContent: `Estás a punto de eliminar "${coupon.code}".`,
            nzOkText: 'Eliminar',
            nzOkDanger: true,
            nzOnOk: () => {
                this.billingService.deleteCoupon(coupon.id).subscribe({
                    next: (success) => {
                        if (success) {
                            this.message.success('Cupón eliminado');
                            this.loadCoupons();
                        } else {
                            this.message.error('No se pudo eliminar');
                        }
                    }
                });
            }
        });
    }
}
