import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'cc-container',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './container.component.html',
    styleUrls: ['./container.component.scss']
})
export class CcContainerComponent {
    @Input() fluid: boolean = false;
    @Input() size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'xl';
}
