import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcStackComponent } from '../../layout/stack/stack.component';
import { CcInlineComponent } from '../../layout/inline/inline.component';

@Component({
    selector: 'cc-list-page-template',
    standalone: true,
    imports: [CommonModule, CcStackComponent],
    templateUrl: './list-page-template.component.html',
    styleUrls: ['./list-page-template.component.scss']
})
export class CcListPageTemplateComponent {
    @Input() title: string = '';
    @Input() description?: string;
    @Input() hasFilters: boolean = true; // Added missing property

    @ContentChild('filters') filtersTemplate?: TemplateRef<any>;
}
