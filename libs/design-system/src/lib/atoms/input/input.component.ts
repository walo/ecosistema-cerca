import { Component, input, forwardRef, signal, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
    selector: 'cc-input',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NzInputModule,
        NzIconModule
    ],
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
    type = input<string>('text');
    placeholder = input<string>('');
    label = input<string>('');
    error = input<boolean>(false);

    _disabled = signal<boolean>(false);
    @Input() set disabled(value: boolean) { this._disabled.set(value); }
    get disabled() { return this._disabled(); }

    size = input<'large' | 'default' | 'small'>('small');
    prefix = input<string | undefined>(undefined);
    suffix = input<string | undefined>(undefined);

    value: string = '';
    passwordVisible = signal<boolean>(false);

    onChange: any = () => { };
    onTouched: any = () => { };

    inputType = computed(() => {
        if (this.type() === 'password') {
            return this.passwordVisible() ? 'text' : 'password';
        }
        return this.type();
    });

    onInputChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.value = target.value;
        this.onChange(this.value);
        this.onTouched();
    }

    togglePasswordVisibility(): void {
        if (this.type() === 'password') {
            this.passwordVisible.update(visible => !visible);
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
        this._disabled.set(isDisabled);
    }
}
