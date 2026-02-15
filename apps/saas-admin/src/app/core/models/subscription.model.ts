
export interface Subscription {
    id: string;
    client_id: string;
    plan_id: string;
    status_id: number;
    start_date: string;
    end_date?: string;
    trial_end_date?: string;
    auto_renew: boolean;
    cancellation_reason?: string;
    cancelled_at?: string;
    created_at?: string;
    updated_at?: string;

    // Joins
    plan?: {
        name: string;
        price: number;
        billing_cycle: number;
    };
    client?: {
        name: string;
    };
    status?: {
        name: string;
    };
}

export interface SubscriptionHistory {
    id: string;
    subscription_id: string;
    plan_id: string;
    status_id: number;
    change_type: number; // 1: Upgrade, 2: Downgrade, 3: Cancel, 4: Reactivate, etc. NO, schema says smallint.
    changed_by?: string;
    notes?: string;
    created_at: string;

    // Joins
    client?: {
        name: string;
    };
    plan?: {
        name: string;
        price: number;
        billing_cycle: number;
    };
    status?: {
        name: string;
    };
}

// Helper enum for change_type if using numbers, or map string if text.
// Schema said smallint.
export enum SubscriptionChangeType {
    CREATED = 1,
    UPGRADE = 2,
    DOWNGRADE = 3,
    CANCELLED = 4,
    REACTIVATED = 5,
    EXPIRED = 6,
    BILLING_UPDATED = 7
}

export interface CreateSubscriptionDTO {
    client_id: string;
    plan_id: string;
    status_id?: number;
    start_date?: string;
}
