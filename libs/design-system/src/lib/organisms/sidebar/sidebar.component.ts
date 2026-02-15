import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CcIconComponent } from '../../atoms/icons/icon.component';

export interface NavItem {
    label: string;
    icon: string;
    route: string;
    badge?: string | number;
    exact?: boolean;
}

@Component({
    selector: 'cc-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule, CcIconComponent],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class CcSidebarComponent {
    @Input() menuItems: NavItem[] = [];
    @Input() collapsed: boolean = false;
    @Input() activeRoute: string = '';

    @Output() navigate = new EventEmitter<NavItem>();
    @Output() toggleCollapse = new EventEmitter<void>();

    onItemClick(item: NavItem) {
        this.navigate.emit(item);
    }
}
