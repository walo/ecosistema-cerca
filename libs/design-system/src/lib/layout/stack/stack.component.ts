import { Component, input, HostBinding, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'cc-stack',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './stack.component.html',
    styleUrls: ['./stack.component.scss']
})
export class CcStackComponent {
    gap = input<number | string>(4);
    align = input<'start' | 'center' | 'end' | 'stretch'>('stretch');
    justify = input<'start' | 'center' | 'end' | 'between'>('start');

    @HostBinding('style.gap')
    get gapStyle(): string {
        const g = this.gap();
        return typeof g === 'number' ? `var(--space-${g})` : g;
    }

    @HostBinding('style.align-items')
    get alignStyle(): string {
        const map = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' };
        return map[this.align()];
    }

    @HostBinding('style.justify-content')
    get justifyStyle(): string {
        const map = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between' };
        const j = this.justify();
        if (j === 'between') return 'space-between';
        return (map as any)[j] || 'flex-start';
    }
}
