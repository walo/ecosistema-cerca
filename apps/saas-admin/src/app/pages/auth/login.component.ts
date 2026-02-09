import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
    NzAlertModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(NonNullableFormBuilder);
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  passwordVisible = false;
  loading = signal(false);
  error = signal<string | null>(null);

  validateForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    remember: [true]
  });

  async submitForm() {
    if (this.validateForm.valid) {
      this.loading.set(true);
      this.error.set(null);

      const { email, password } = this.validateForm.getRawValue();

      try {
        const { error } = await this.supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          this.error.set('Acceso no autorizado. Verifica tus credenciales.');
        } else {
          this.router.navigate(['/dashboard']);
        }
      } catch (e) {
        this.error.set('Error crítico de conexión.');
      } finally {
        this.loading.set(false);
      }
    }
  }
}
