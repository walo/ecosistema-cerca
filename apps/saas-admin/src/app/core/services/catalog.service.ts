import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    CatalogCategory,
    CatalogItem,
    CreateCatalogCategoryDTO,
    UpdateCatalogCategoryDTO,
    CreateCatalogItemDTO,
    UpdateCatalogItemDTO
} from '../models/catalog.model';

@Injectable({
    providedIn: 'root'
})
export class CatalogService {
    private supabase = inject(SupabaseService);

    // --- Categories ---

    getCategories(): Observable<CatalogCategory[]> {
        return from(
            this.supabase.client
                .from('catalog_categories')
                .select('*')
                .order('name', { ascending: true })
        ).pipe(map(res => res.data || []));
    }

    getCategory(id: number): Observable<CatalogCategory | null> {
        return from(
            this.supabase.client
                .from('catalog_categories')
                .select('*')
                .eq('id', id)
                .single()
        ).pipe(map(res => res.data));
    }

    createCategory(category: CreateCatalogCategoryDTO): Observable<CatalogCategory | null> {
        return from(
            this.supabase.client
                .from('catalog_categories')
                .insert(category)
                .select()
                .single()
        ).pipe(map(res => res.data));
    }

    updateCategory(id: number, category: UpdateCatalogCategoryDTO): Observable<CatalogCategory | null> {
        return from(
            this.supabase.client
                .from('catalog_categories')
                .update(category)
                .eq('id', id)
                .select()
                .single()
        ).pipe(map(res => res.data));
    }

    deleteCategory(id: number): Observable<boolean> {
        return from(
            this.supabase.client
                .from('catalog_categories')
                .delete()
                .eq('id', id)
        ).pipe(map(res => !res.error));
    }

    // --- Items ---

    getItems(categoryId?: number): Observable<CatalogItem[]> {
        let query = this.supabase.client
            .from('catalog_items')
            .select('*, category:catalog_categories(name)');

        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        return from(
            query.order('sort_order', { ascending: true })
        ).pipe(map(res => res.data || []));
    }

    getItem(id: number): Observable<CatalogItem | null> {
        return from(
            this.supabase.client
                .from('catalog_items')
                .select('*')
                .eq('id', id)
                .single()
        ).pipe(map(res => res.data));
    }

    createItem(item: CreateCatalogItemDTO): Observable<CatalogItem | null> {
        return from(
            this.supabase.client
                .from('catalog_items')
                .insert(item)
                .select()
                .single()
        ).pipe(map(res => res.data));
    }

    updateItem(id: number, item: UpdateCatalogItemDTO): Observable<CatalogItem | null> {
        return from(
            this.supabase.client
                .from('catalog_items')
                .update(item)
                .eq('id', id)
                .select()
                .single()
        ).pipe(map(res => res.data));
    }

    deleteItem(id: number): Observable<boolean> {
        return from(
            this.supabase.client
                .from('catalog_items')
                .delete()
                .eq('id', id)
        ).pipe(map(res => !res.error));
    }
}
