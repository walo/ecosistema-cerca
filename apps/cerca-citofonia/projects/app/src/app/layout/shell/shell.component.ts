import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CcAdminLayoutComponent, CcSidebarComponent } from '@cerca/design-system';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, CcAdminLayoutComponent],
  template: `
    <cc-admin-layout 
      [user]="currentUser" 
      [menuItems]="navigationItems"
      [notificationsCount]="3">
      <router-outlet></router-outlet>
    </cc-admin-layout>
  `,
  styles: []
})
export class ShellComponent {
  currentUser = {
    name: 'Admin User',
    role: 'Administrador',
    avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User'
  };

  navigationItems = [
    { label: 'Escritorio', icon: 'dashboard', route: '/app/dashboard', exact: true },
    { label: 'Residentes', icon: 'group', route: '/app/residents' },
    { label: 'Visitas', icon: 'person_add', route: '/app/visits' },
    { label: 'Comunicados', icon: 'campaign', route: '/app/communication' },
    { label: 'Paquetes', icon: 'inventory_2', route: '/app/packages' },
    { label: 'Configuración', icon: 'settings', route: '/app/settings' }
  ];
}
