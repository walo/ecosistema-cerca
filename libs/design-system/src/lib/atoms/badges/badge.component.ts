import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeType = 'filled' | 'subtle' | 'outline';

@Component({
    selector: 'cc-badge',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './badge.component.html',
    styleUrls: ['./badge.component.scss']
})
export class CcBadgeComponent {
    @Input() variant: BadgeVariant = 'neutral';
    @Input() type: BadgeType = 'subtle';
}
