import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AccessService } from '../../../../core/services/access.service';
import { Permission } from '../../../../core/models/access.model';

@Component({
    selector: 'app-permission-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NzModalModule,
        NzFormModule,
        NzInputModule,
        NzSelectModule,
        NzButtonModule
    ],
    templateUrl: './permission-form.component.html',
    styleUrls: ['./permission-form.component.scss']
})
export class PermissionFormComponent implements OnInit {
    permission?: Permission; // Input if editing

    form!: FormGroup;
    isLoading = false;

    private fb = inject(FormBuilder);
    private accessService = inject(AccessService);
    private modalRef = inject(NzModalRef);
    private message = inject(NzMessageService);

    ngOnInit(): void {
        this.initForm();
        if (this.permission) {
            this.form.patchValue(this.permission);
        }
    }

    private initForm(): void {
        this.form = this.fb.group({
            module: [null, [Validators.required]],
            option: [null, [Validators.required]],
            route: [null],
            description: [null],
            status_id: [1, [Validators.required]] // Default Active
        });
    }

    submitForm(): void {
        if (this.form.invalid) {
            Object.values(this.form.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
            return;
        }

        this.isLoading = true;
        const formValue = this.form.value;

        const request$ = this.permission
            ? this.accessService.updatePermission(this.permission.id, formValue)
            : this.accessService.createPermission(formValue);

        request$.subscribe({
            next: (res) => {
                this.isLoading = false;
                if (res) {
                    this.message.success(`Permiso ${this.permission ? 'actualizado' : 'creado'} correctamente`);
                    this.modalRef.destroy(true);
                } else {
                    this.message.error('No se pudo guardar el permiso');
                }
            },
            error: (err) => {
                this.isLoading = false;
                console.error(err);
                this.message.error('Ocurrió un error al guardar');
            }
        });
    }

    close(): void {
        this.modalRef.destroy();
    }
}
