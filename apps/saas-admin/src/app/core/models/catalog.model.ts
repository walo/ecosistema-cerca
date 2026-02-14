
export interface CatalogCategory {
    id: number;
    code: string;
    name: string; // The display name
    description?: string;
    created_at?: string;
}

export interface CatalogItem {
    id: number;
    category_id: number;
    code: string;
    name: string;
    description?: string;
    is_active: boolean;
    sort_order: number;
    created_at?: string;

    // Optional joined fields
    category?: CatalogCategory;
}

// Payload interfaces for creation/update
export interface CreateCatalogCategoryDTO extends Omit<CatalogCategory, 'id' | 'created_at'> { }
export interface UpdateCatalogCategoryDTO extends Partial<CreateCatalogCategoryDTO> { }

export interface CreateCatalogItemDTO extends Omit<CatalogItem, 'id' | 'created_at' | 'category'> { }
export interface UpdateCatalogItemDTO extends Partial<CreateCatalogItemDTO> { }
