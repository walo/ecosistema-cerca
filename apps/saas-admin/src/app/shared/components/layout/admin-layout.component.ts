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
      label: 'Gestión de Clientes',
      icon: 'team',
      children: [
        {
          path: '/clients',
          label: 'Conjuntos',
          icon: 'shop'
        },
        {
          path: '/audit',
          label: 'Auditoría',
          icon: 'reconciliation'
        },
        {
          path: '/subscriptions',
          label: 'Suscripciones',
          icon: 'schedule'
        }
      ]
    },
    {
      label: 'Catálogo y Planes',
      icon: 'gold',
      children: [
        {
          path: '/plans',
          label: 'Planes',
          icon: 'gold',
          exact: true
        },
        {
          path: '/plans/features',
          label: 'Características',
          icon: 'appstore'
        },
        {
          path: '/catalog/categories',
          label: 'Categorías',
          icon: 'tags'
        },
        {
          path: '/catalog/items',
          label: 'Items del Catálogo',
          icon: 'barcode'
        }
      ]
    },
    {
      label: 'Facturación',
      icon: 'dollar-circle',
      children: [
        {
          path: '/billing/invoices',
          label: 'Facturas',
          icon: 'file-text'
        },
        {
          path: '/billing/coupons',
          label: 'Cupones',
          icon: 'percentage'
        }
      ]
    },
    {
      label: 'Control de Acceso',
      icon: 'safety',
      children: [
        {
          path: '/access/users',
          label: 'Administradores',
          icon: 'user-add'
        },
        {
          path: '/access/permissions',
          label: 'Permisos',
          icon: 'safety-certificate'
        }
      ]
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
