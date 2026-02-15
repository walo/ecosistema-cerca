import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AccessService } from '../../../../core/services/access.service';
import { AdminUser } from '../../../../core/models/access.model';

@Component({
    selector: 'app-admin-user-role-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NzModalModule,
        NzFormModule,
        NzSelectModule,
        NzButtonModule
    ],
    templateUrl: './admin-user-role-form.component.html',
    styleUrls: ['./admin-user-role-form.component.scss']
})
export class AdminUserRoleFormComponent implements OnInit {
    adminUser?: AdminUser;

    form!: FormGroup;
    isLoading = false;

    private fb = inject(FormBuilder);
    private accessService = inject(AccessService);
    private modalRef = inject(NzModalRef);
    private message = inject(NzMessageService);

    ngOnInit(): void {
        this.form = this.fb.group({
            role: [this.adminUser?.role || 'viewer', [Validators.required]]
        });
    }

    submitForm(): void {
        if (this.form.invalid || !this.adminUser) return;

        this.isLoading = true;
        const newRole = this.form.value.role;

        this.accessService.updateAdminUserRole(this.adminUser.user_id, newRole).subscribe({
            next: (res) => {
                this.isLoading = false;
                if (res) {
                    this.message.success('Rol actualizado correctamente');
                    this.modalRef.destroy(true);
                } else {
                    this.message.error('No se pudo actualizar el rol');
                }
            },
            error: (err) => {
                this.isLoading = false;
                console.error(err);
                this.message.error('Error al actualizar');
            }
        });
    }

    close(): void {
        this.modalRef.destroy();
    }
}
