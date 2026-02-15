import { Component, input, signal, Input } from '@angular/core';
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
    title = input<string>('');
    extra = input<string | undefined>(undefined);
    loading = input<boolean>(false);
    bordered = input<boolean>(true);
    padding = input<string | number>('24px');
}
