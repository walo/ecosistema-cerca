import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CcIconComponent } from '../../atoms/icons/icon.component';
import { CcInputComponent } from '../../atoms/input/input.component';

@Component({
    selector: 'cc-search-bar',
    standalone: true,
    imports: [CommonModule, FormsModule, CcIconComponent],
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class CcSearchBarComponent implements OnInit, OnDestroy {
    @Input() placeholder: string = 'Buscar...';
    @Input() debounce: number = 300;
    @Input() loading: boolean = false;
    @Input() variant: 'standalone' | 'header' = 'standalone';

    @Output() search = new EventEmitter<string>();

    searchQuery: string = '';
    private searchSubject = new Subject<string>();
    private subscription: Subscription = new Subscription();

    ngOnInit() {
        this.subscription = this.searchSubject
            .pipe(
                debounceTime(this.debounce),
                distinctUntilChanged()
            )
            .subscribe(query => {
                this.search.emit(query);
            });
    }

    onQueryChange() {
        this.searchSubject.next(this.searchQuery);
    }

    clear() {
        this.searchQuery = '';
        this.onQueryChange();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
