import { Component, input, HostBinding, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'cc-inline',
    standalone: true,
    imports: [CommonModule],
    template: '<ng-content></ng-content>',
    styles: [`
    :host {
      display: flex;
      flex-direction: row;
      flex-wrap: var(--inline-wrap, nowrap);
      align-items: var(--inline-align, center);
      justify-content: var(--inline-justify, flex-start);
      gap: var(--inline-gap, var(--space-4));
    }
  `]
})
export class CcInlineComponent {
    gap = input<number | string>(4);
    align = input<'start' | 'center' | 'end' | 'baseline'>('center');
    justify = input<'start' | 'center' | 'end' | 'between' | 'around'>('start');
    wrap = input<boolean>(false);

    @HostBinding('style.--inline-gap')
    get gapStyle(): string {
        const g = this.gap();
        return typeof g === 'number' ? `var(--space-${g})` : g;
    }

    @HostBinding('style.--inline-align')
    get alignStyle(): string {
        const map = { start: 'flex-start', center: 'center', end: 'flex-end', baseline: 'baseline' };
        return map[this.align()];
    }

    @HostBinding('style.--inline-justify')
    get justifyStyle(): string {
        const map = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between', around: 'space-around' };
        return map[this.justify()];
    }

    @HostBinding('style.--inline-wrap')
    get wrapStyle(): string {
        return this.wrap() ? 'wrap' : 'nowrap';
    }
}
