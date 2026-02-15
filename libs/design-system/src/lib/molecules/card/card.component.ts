import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
    selector: 'cc-card',
    standalone: true,
    imports: [CommonModule, NzCardModule],
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CcCardComponent {
    @Input() title?: string;
    @Input() padding: string = '6';
    @Input() hoverable: boolean = false;
    @Input() bordered: boolean = true;
    @Input() loading: boolean = false;
    @Input() size: 'default' | 'small' = 'default';
}
