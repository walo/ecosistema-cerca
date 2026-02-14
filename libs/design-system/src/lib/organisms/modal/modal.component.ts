import { Component, Input, Output, EventEmitter, HostListener, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcIconComponent } from '../../atoms/icons/icon.component';
import { CcButtonComponent } from '../../atoms/button/button.component';

@Component({
    selector: 'cc-modal',
    standalone: true,
    imports: [CommonModule, CcIconComponent],
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class CcModalComponent {
    @Input() isOpen: boolean = false;
    @Input() title: string = '';
    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() closeOnOverlay: boolean = true;
    @Input() showFooter: boolean = true;

    @Output() close = new EventEmitter<void>();

    onOverlayClick(event: MouseEvent) {
        if (this.closeOnOverlay && (event.target as HTMLElement).classList.contains('cc-modal-overlay')) {
            this.close.emit();
        }
    }

    @HostListener('document:keydown.escape')
    onEscape() {
        if (this.isOpen) {
            this.close.emit();
        }
    }
}
