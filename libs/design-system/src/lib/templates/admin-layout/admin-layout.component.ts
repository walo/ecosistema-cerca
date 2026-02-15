import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcHeaderComponent, HeaderUser } from '../../organisms/header/header.component';
import { CcSidebarComponent } from '../../organisms/sidebar/sidebar.component';

@Component({
    selector: 'cc-admin-layout',
    standalone: true,
    imports: [CommonModule, CcHeaderComponent, CcSidebarComponent],
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.scss']
})
export class CcAdminLayoutComponent {
    @Input() user?: HeaderUser;
    @Input() menuItems: any[] = [];
    @Input() notificationsCount: number = 0;

    isSidebarCollapsed = false;
    isMobileMenuOpen = false;

    toggleSidebar() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    onNavItemClick(item: any) {
        if (this.isMobileMenuOpen) {
            this.isMobileMenuOpen = false;
        }
    }

    onUserAction(action: string) {
        console.log('User action:', action);
    }
}
