import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcStackComponent } from '../../layout/stack/stack.component';

@Component({
    selector: 'cc-form-page-template',
    standalone: true,
    imports: [CommonModule, CcStackComponent],
    templateUrl: './form-page-template.component.html',
    styleUrls: ['./form-page-template.component.scss']
})
export class CcFormPageTemplateComponent {
    @Input() title: string = '';
    @Input() backUrl?: string;
    @Input() loading: boolean = false;
}
