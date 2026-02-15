import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CcInputComponent } from '../../atoms/input/input.component';
import { CcButtonComponent } from '../../atoms/button/button.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ɵNzTransitionPatchDirective } from "ng-zorro-antd/core/transition-patch";

@Component({
    selector: 'cc-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CcInputComponent,
        CcButtonComponent,
        NzAlertModule,
        NzCheckboxModule,
        NzFormModule,
        NzInputModule,
        ɵNzTransitionPatchDirective
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class CcLoginComponent {
    private fb = inject(FormBuilder);

    @Input() title: string = 'Bienvenido';
    @Input() titleAccent: string | undefined;
    @Input() subtitle: string = 'Inicia sesión para continuar';
    @Input() logoUrl: string | undefined;
    @Input() icon: string | undefined;
    @Input() loading: boolean = false;
    @Input() errorMessage: string | null = null;
    @Input() supportEmail: string = 'soporte@cerca.com.co';

    // Optional: URL to navigate for password recovery
    // Optional: URL to navigate for password recovery
    @Input() recoverPasswordUrl: string | undefined;
    @Input() forgotPasswordLabel: string = '¿Olvidaste tu clave?';

    @Output() loginSubmit = new EventEmitter<{ email: string; password: string; remember: boolean }>();
    @Output() forgotPasswordClick = new EventEmitter<void>();

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        remember: [true]
    });

    submitForm(): void {
        if (this.loginForm.valid) {
            const { email, password, remember } = this.loginForm.getRawValue();
            this.loginSubmit.emit({ email: email!, password: password!, remember: remember! });
        } else {
            Object.values(this.loginForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }

    fieldInvalid(field: string): boolean {
        const control = this.loginForm.get(field);
        return (control && control.invalid && (control.dirty || control.touched)) || false;
    }

}
