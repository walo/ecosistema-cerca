import { Component, Input, ContentChild, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcLabelComponent } from '../../atoms/labels/label.component';

@Component({
    selector: 'cc-form-field',
    standalone: true,
    imports: [CommonModule, CcLabelComponent],
    templateUrl: './form-field.component.html',
    styleUrls: ['./form-field.component.scss']
})
export class CcFormFieldComponent {
    @Input() label: string = '';
    @Input() hint: string = '';
    @Input() errorMessage: string | null = null;
    @Input() required: boolean = false;
    @Input() error: boolean = false;
    @Input() for: string = '';

    get hasError(): boolean {
        return !!this.errorMessage;
    }
}
