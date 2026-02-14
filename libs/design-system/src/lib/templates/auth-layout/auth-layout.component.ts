import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'cc-auth-layout',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './auth-layout.component.html',
    styleUrls: ['./auth-layout.component.scss']
})
export class CcAuthLayoutComponent {
    @Input() backgroundType: 'gradient' | 'image' | 'simple' = 'gradient';
}
