import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzAvatarModule,
    NzDropDownModule,
    NzBadgeModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  router = inject(Router);

  isCollapsed = false;

  menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      exact: true
    },
    {
      path: '/clients',
      label: 'Conjuntos (Clientes)',
      icon: 'team'
    },
    {
      path: '/plans',
      label: 'Planes y Costos',
      icon: 'gold'
    },
    {
      path: '/plans/features',
      label: 'Características',
      icon: 'appstore'
    },
    {
      path: '/billing',
      label: 'Facturación',
      icon: 'dollar-circle'
    },
    {
      path: '/audit',
      label: 'Auditoría',
      icon: 'reconciliation'
    },
    {
      path: '/admins',
      label: 'Administradores',
      icon: 'user-add'
    },
    {
      path: '/settings',
      label: 'Configuración',
      icon: 'setting'
    },
  ];

  logout() {
    this.auth.signOut().subscribe(() => {
      this.router.navigate(['/auth']);
    });
  }
}
