import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';

export interface SelectOption {
    label: string;
    value: any;
}

@Component({
    selector: 'cc-select',
    standalone: true,
    imports: [CommonModule, FormsModule, NzSelectModule],
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CcSelectComponent),
            multi: true
        }
    ]
})
export class CcSelectComponent implements ControlValueAccessor {
    @Input() options: SelectOption[] = [];
    @Input() placeholder: string = 'Seleccionar opción';
    @Input() disabled: boolean = false;
    @Input() label: string = '';
    @Input() size: 'large' | 'default' | 'small' = 'default';
    @Input() allowClear: boolean = true;
    @Input() showSearch: boolean = false;

    value: any;
    onChange: any = () => { };
    onTouched: any = () => { };

    onValueChange(value: any): void {
        this.value = value;
        this.onChange(value);
        this.onTouched();
    }

    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
