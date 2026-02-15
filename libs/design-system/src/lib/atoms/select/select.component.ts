import { Component, input, signal, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { NzSelectComponent, NzOptionComponent } from 'ng-zorro-antd/select';

export interface SelectOption {
    label: string;
    value: any;
}

@Component({
    selector: 'cc-select',
    standalone: true,
    imports: [CommonModule, FormsModule, NzSelectComponent, NzOptionComponent],
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
    options = input<SelectOption[]>([]);
    placeholder = input<string>('Seleccionar opción');
    label = input<string>('');
    size = input<'large' | 'default' | 'small'>('default');
    allowClear = input<boolean>(true);
    showSearch = input<boolean>(false);

    _disabled = signal<boolean>(false);
    @Input() set disabled(value: boolean) { this._disabled.set(value); }
    get disabled() { return this._disabled(); }

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

    setDisabledState(isDisabled: boolean): void {
        this._disabled.set(isDisabled);
    }
}
