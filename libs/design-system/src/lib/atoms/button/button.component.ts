import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

type ButtonType = 'primary' | 'default' | 'dashed' | 'text' | 'link';

@Component({
    selector: 'cc-button',
    standalone: true,
    imports: [CommonModule, NzButtonModule, NzIconModule],
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class CcButtonComponent {
    @Input() variant: 'primary' | 'secondary' | 'ghost' | 'outline' = 'primary';
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() disabled: boolean = false;
    @Input() loading: boolean = false;
    @Input() icon?: string;
    @Input() size: 'large' | 'default' | 'small' = 'default';

    /**
     * Maps our custom variant names to ng-zorro button types
     */
    get nzType(): ButtonType {
        const variantMap: Record<string, ButtonType> = {
            'primary': 'primary',
            'secondary': 'default',
            'ghost': 'text',
            'outline': 'dashed'
        };
        return variantMap[this.variant] || 'default';
    }
}
