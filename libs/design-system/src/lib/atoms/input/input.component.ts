import { Component, Input, forwardRef, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
    selector: 'cc-input',
    standalone: true,
    imports: [CommonModule, FormsModule, NzInputModule, NzIconModule],
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CcInputComponent),
            multi: true
        }
    ]
})
export class CcInputComponent implements ControlValueAccessor {
    @Input() type: string = 'text';
    @Input() placeholder: string = '';
    @Input() disabled: boolean = false;
    @Input() error: boolean = false;
    @Input() size: 'large' | 'default' | 'small' = 'default';
    @Input() prefix?: string; // Icon prefix name

    @ViewChild('prefixTemplate', { static: true }) prefixTemplateRef!: TemplateRef<void>;
    @ViewChild('suffixTemplate', { static: true }) suffixTemplateRef!: TemplateRef<void>;
    @Input() suffix?: string; // Icon suffix name

    value: string = '';
    passwordVisible: boolean = false;

    onChange: any = () => { };
    onTouched: any = () => { };

    get inputType(): string {
        if (this.type === 'password') {
            return this.passwordVisible ? 'text' : 'password';
        }
        return this.type;
    }

    onInputChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.value = target.value;
        this.onChange(this.value);
        this.onTouched();
    }

    togglePasswordVisibility(): void {
        if (this.type === 'password') {
            this.passwordVisible = !this.passwordVisible;
        }
    }

    writeValue(value: any): void {
        this.value = value || '';
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
