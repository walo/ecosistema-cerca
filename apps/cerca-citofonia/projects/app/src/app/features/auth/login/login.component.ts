import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CcLoginComponent } from '@cerca/design-system';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        CcLoginComponent
    ],
    providers: [
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    isLoading = false;
    message: string | null = null;
    isError = false;

    async onSubmit(event: { email: string; password: string; remember: boolean }) {
        this.isLoading = true;
        this.message = null;
        this.isError = false;

        try {
            const { email, password } = event;
            await firstValueFrom(this.authService.login(email, password));
            this.router.navigate(['/app/dashboard']);
        } catch (error: any) {
            this.isError = true;
            this.message = error.message || 'Ocurrió un error al intentar iniciar sesión.';
            this.isLoading = false;
        }
    }


}
