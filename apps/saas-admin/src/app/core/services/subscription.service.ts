import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subscription, SubscriptionHistory } from '../models/subscription.model';

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    private supabase = inject(SupabaseService);

    // --- Subscriptions ---

    getSubscriptions(): Observable<Subscription[]> {
        return from(
            this.supabase.client
                .from('client_subscriptions')
                .select(`
                    *,
                    plan:plans (name, price, billing_cycle),
                    client:clients (name),
                    status:catalog_items!status_id(name)
                `)
                .eq('status_id', 7)
                .order('start_date', { ascending: false })
        ).pipe(map(res => res.data || []));
    }

    getSubscriptionById(id: string): Observable<Subscription | null> {
        return from(
            this.supabase.client
                .from('client_subscriptions')
                .select(`
                    *,
                    plan:plans (name, price, billing_cycle),
                    client:clients (name)
                `)
                .eq('id', id)
                .single()
        ).pipe(map(res => res.data));
    }

    // --- History / Audit ---

    getSubscriptionHistory(): Observable<SubscriptionHistory[]> {
        return from(
            this.supabase.client
                .from('client_subscriptions')
                .select(`
                    *,
                    plan:plans(name, price, billing_cycle),
                    client:clients(name),
                    status:catalog_items!status_id(name)
                `)
                .order('created_at', { ascending: false })
                .limit(100)
        ).pipe(map(res => res.data || []));
    }

    getHistoryBySubscription(subscriptionId: string): Observable<SubscriptionHistory[]> {
        return from(
            this.supabase.client
                .from('subscription_history')
                .select('*')
                .eq('subscription_id', subscriptionId)
                .order('created_at', { ascending: false })
        ).pipe(map(res => res.data || []));
    }
}
