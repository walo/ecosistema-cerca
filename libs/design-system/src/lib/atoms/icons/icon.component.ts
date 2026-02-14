import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'cc-icon',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss']
})
export class CcIconComponent {
    @Input() name: string = '';
    @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
    @Input() color: string = 'currentColor';

    get iconClass(): string {
        return `icon-${this.size}`;
    }
}
