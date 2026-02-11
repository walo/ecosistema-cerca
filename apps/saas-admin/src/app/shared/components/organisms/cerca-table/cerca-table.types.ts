export interface TableColumn {
    key: string;
    label: string;
    type: 'text' | 'template' | 'status' | 'actions';
    templateRef?: any; // For 'template' type
    sortable?: boolean;
    filter?: {
        type: 'text' | 'select' | 'date';
        options?: { label: string; value: any }[];
        placeholder?: string;
        dropdownVisible?: boolean;
        searchValue?: any;
    };
    width?: string;
    align?: 'left' | 'center' | 'right';
    actionConfig?: {
        icon: string;
        callback: (row: any) => void;
        tooltip?: string;
        danger?: boolean;

    }[];
    statusMap?: Record<number | string, string>;
}

export interface TablePagination {
    pageIndex: number;
    pageSize: number;
    total: number;
}
