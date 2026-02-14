import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CcInputComponent } from '@cerca/design-system';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzIconModule,
        NzCheckboxModule,
        NzAlertModule,
        NzGridModule,
        CcInputComponent
    ],
    providers: [
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        remember: [true]
    });



    isLoading = false;
    message: string | null = null;
    isError = false;

    async onSubmit() {
        if (this.loginForm.invalid) {
            Object.values(this.loginForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
            return;
        }

        this.isLoading = true;
        this.message = null;
        this.isError = false;

        try {
            const { email, password } = this.loginForm.value;
            await firstValueFrom(this.authService.login(email!, password!));
            this.router.navigate(['/app/dashboard']);
        } catch (error: any) {
            this.isError = true;
            this.message = error.message || 'Ocurrió un error al intentar iniciar sesión.';
            this.isLoading = false;
        }
    }

    fieldInvalid(field: string): boolean {
        const control = this.loginForm.get(field);
        return (control && control.invalid && (control.dirty || control.touched)) || false;
    }
}
