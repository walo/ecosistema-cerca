import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    Coupon,
    CreateCouponDTO,
    UpdateCouponDTO
} from '../models/billing.model';

@Injectable({
    providedIn: 'root'
})
export class BillingService {
    private supabase = inject(SupabaseService);

    // --- Coupons ---

    getCoupons(): Observable<Coupon[]> {
        return from(
            this.supabase.client
                .from('coupons')
                .select('*')
                .order('created_at', { ascending: false })
        ).pipe(map(res => res.data || []));
    }

    getCoupon(id: string): Observable<Coupon | null> {
        return from(
            this.supabase.client
                .from('coupons')
                .select('*')
                .eq('id', id)
                .single()
        ).pipe(map(res => res.data));
    }

    createCoupon(coupon: CreateCouponDTO): Observable<Coupon | null> {
        return from(
            this.supabase.client
                .from('coupons')
                .insert(coupon)
                .select()
                .single()
        ).pipe(map(res => res.data));
    }

    updateCoupon(id: string, coupon: UpdateCouponDTO): Observable<Coupon | null> {
        return from(
            this.supabase.client
                .from('coupons')
                .update(coupon)
                .eq('id', id)
                .select()
                .single()
        ).pipe(map(res => res.data));
    }

    deleteCoupon(id: string): Observable<boolean> {
        return from(
            this.supabase.client
                .from('coupons')
                .delete()
                .eq('id', id)
        ).pipe(map(res => !res.error));
    }

    // Future: Invoices, Payments, etc.
}
