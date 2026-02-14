
export enum DiscountType {
    PERCENTAGE = 1,
    FIXED_AMOUNT = 2
}

export interface Coupon {
    id: string;
    code: string;
    description?: string;
    discount_type: DiscountType;
    discount_value: number;
    max_redemptions?: number;
    current_redemptions: number;
    valid_from: string;
    valid_until: string;
    applicable_plans?: string[]; // Array of Plan IDs
    is_active: boolean;
    created_at?: string;
}

export interface CouponUsage {
    id: string;
    coupon_id: string;
    client_id: string;
    subscription_id: string;
    used_at: string;

    // Optional joins
    coupon?: Coupon;
}

export interface CreateCouponDTO extends Omit<Coupon, 'id' | 'current_redemptions' | 'created_at'> { }
export interface UpdateCouponDTO extends Partial<CreateCouponDTO> { }
