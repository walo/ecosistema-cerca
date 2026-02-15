import { Component, Input, HostBinding } from '@angular/core';
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
    @Input() gap: number | string = 4;
    @Input() align: 'start' | 'center' | 'end' | 'baseline' = 'center';
    @Input() justify: 'start' | 'center' | 'end' | 'between' | 'around' = 'start';
    @Input() wrap: boolean = false;

    @HostBinding('style.--inline-gap')
    get gapStyle(): string {
        return typeof this.gap === 'number' ? `var(--space-${this.gap})` : this.gap;
    }

    @HostBinding('style.--inline-align')
    get alignStyle(): string {
        const map = { start: 'flex-start', center: 'center', end: 'flex-end', baseline: 'baseline' };
        return map[this.align];
    }

    @HostBinding('style.--inline-justify')
    get justifyStyle(): string {
        const map = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between', around: 'space-around' };
        return map[this.justify];
    }

    @HostBinding('style.--inline-wrap')
    get wrapStyle(): string {
        return this.wrap ? 'wrap' : 'nowrap';
    }
}
