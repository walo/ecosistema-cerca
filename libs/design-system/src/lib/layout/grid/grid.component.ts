import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'cc-grid',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss']
})
export class CcGridComponent {
    @Input() cols: number = 1;
    @Input() colsMd?: number;
    @Input() colsLg?: number;
    @Input() gap: number = 4;

    @HostBinding('class')
    get classes(): string {
        return [
            `cc-grid-cols-${this.cols}`,
            this.colsMd ? `cc-grid-cols-md-${this.colsMd}` : '',
            this.colsLg ? `cc-grid-cols-lg-${this.colsLg}` : '',
            `cc-grid-gap-${this.gap}`
        ].filter(Boolean).join(' ');
    }
}
