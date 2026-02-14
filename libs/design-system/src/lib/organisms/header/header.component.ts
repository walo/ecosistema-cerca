import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcIconComponent } from '../../atoms/icons/icon.component';
import { CcBadgeComponent } from '../../atoms/badges/badge.component';
import { CcButtonComponent } from '../../atoms/button/button.component';

export interface HeaderUser {
    name: string;
    role: string;
    avatarUrl?: string;
}

@Component({
    selector: 'cc-header',
    standalone: true,
    imports: [CommonModule, CcIconComponent, CcBadgeComponent],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class CcHeaderComponent {
    @Input() user?: HeaderUser;
    @Input() notificationsCount: number = 0;
    @Input() showMenuButton: boolean = true;
    @Input() hasLogoContent: boolean = true; // Added missing property

    @Output() toggleSidebar = new EventEmitter<void>();
    @Output() userClick = new EventEmitter<void>();
    @Output() notificationClick = new EventEmitter<void>();
    @Output() userAction = new EventEmitter<string>();

    onUserClick() {
        this.userClick.emit();
        this.userAction.emit('profile');
    }

    get initials(): string {
        if (!this.user?.name) return '?';
        return this.user.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }
}
