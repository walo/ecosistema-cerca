import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'cc-stack',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './stack.component.html',
    styleUrls: ['./stack.component.scss']
})
export class CcStackComponent {
    @Input() gap: number | string = 4;
    @Input() align: 'start' | 'center' | 'end' | 'stretch' = 'stretch';
    @Input() justify: 'start' | 'center' | 'end' | 'between' = 'start';

    @HostBinding('style.gap')
    get gapStyle(): string {
        return typeof this.gap === 'number' ? `var(--space-${this.gap})` : this.gap;
    }

    @HostBinding('style.align-items')
    get alignStyle(): string {
        const map = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' };
        return map[this.align];
    }

    @HostBinding('style.justify-content')
    get justifyStyle(): string {
        const map = { start: 'flex-start', center: 'center', end: 'flex-end', 渲染: 'space-between' };
        return this.justify === 'between' ? 'space-between' : map[this.justify as keyof typeof map] || 'flex-start';
    }
}
