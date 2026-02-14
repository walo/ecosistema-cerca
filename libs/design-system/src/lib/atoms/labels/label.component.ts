import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'cc-label',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './label.component.html',
    styleUrls: ['./label.component.scss']
})
export class CcLabelComponent {
    @Input() text: string = '';
    @Input() for: string = '';
    @Input() required: boolean = false;
    @Input() error: boolean = false;
}
