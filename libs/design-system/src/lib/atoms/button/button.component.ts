import { Component, input, computed, Input, signal } from '@angular/core';
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
    variant = input<'primary' | 'secondary' | 'ghost' | 'outline'>('primary');
    type = input<'button' | 'submit' | 'reset'>('button');

    _disabled = signal<boolean>(false);
    @Input() set disabled(value: boolean) { this._disabled.set(value); }
    get disabled() { return this._disabled(); }

    loading = input<boolean>(false);
    icon = input<string | undefined>(undefined);
    size = input<'large' | 'default' | 'small'>('default');

    nzType = computed<ButtonType>(() => {
        const variantMap: Record<string, ButtonType> = {
            'primary': 'primary',
            'secondary': 'default',
            'ghost': 'text',
            'outline': 'dashed'
        };
        return variantMap[this.variant()] || 'default';
    });
}
