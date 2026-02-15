import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service'; // Asumiendo que existe uno similar al de admin-web
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Plan {
    id: string;
    code: string;
    name: string;
    description: string;
    price: number;
    billing_cycle: number;
    trial_days: number;
    is_active: boolean;
    max_users?: number;
    max_branches?: number;
    max_appointments_per_month?: number;
    created_at: string;
    updated_at?: string;
}

export interface PlanFeature {
    id: string;
    plan_id: string;
    feature_definition_id: string;
    value: string;
    description?: string;
    sequence: number;
    created_at?: string;
}

export interface FeatureDefinition {
    id: string;
    key: string;
    label: string;
    description?: string;
    data_type: 'boolean' | 'number' | 'text';
    created_at?: string;
    updated_at?: string;
}

export interface Client {
    id: string;
    name: string;
    contact_name?: string;
    contact_email: string;
    contact_phone?: string;
    status_id: number;
    created_at: string;
    updated_at?: string;

    // JOIN with active subscription
    active_subscription?: Array<{
        id: string;
        plan?: {
            name: string;
            price: number;
            billing_cycle: number;
        };
        status?: {
            name: string;
        };
        start_date: string;
        end_date?: string;
    }>;
}

@Injectable({
    providedIn: 'root'
})
export class AdminSubscriptionService {
    private supabase = inject(SupabaseService);

    async getClientsCount(): Promise<number> {
        const { count } = await this.supabase.client
            .from('clients')
            .select('*', { count: 'exact', head: true });
        return count || 0;
    }

    async getPendingInvoicesCount(): Promise<number> {
        const { data: pendingStatus } = await this.supabase.client
            .from('catalog_items')
            .select('id')
            .eq('code', 'pendiente')
            .single();

        const { count } = await this.supabase.client
            .from('invoices')
            .select('*', { count: 'exact', head: true })
            .eq('status_id', pendingStatus?.id);
        return count || 0;
    }

    async getMRR(): Promise<number> {
        // Obtener el ID del estado 'activa'
        const { data: activeStatus } = await this.supabase.client
            .from('catalog_items')
            .select('id')
            .eq('code', 'activa')
            .single();

        // Cálculo simplificado de MRR sumando planes de clientes activos
        const { data } = await this.supabase.client
            .from('clients')
            .select(`
                client_subscriptions!inner (
                    plan:plans (price)
                )
            `)
            .eq('status_id', activeStatus?.id);

        return data?.reduce((acc, curr: any) => acc + (curr.client_subscriptions?.[0]?.plan?.price || 0), 0) || 0;
    }

    getPlans(): Observable<Plan[]> {
        return from(
            this.supabase.client
                .from('plans')
                .select('*')
                .order('created_at', { ascending: false })
        ).pipe(map(res => res.data || []));
    }

    createPlan(plan: Partial<Plan>): Observable<Plan | null> {
        return from(
            this.supabase.client
                .from('plans')
                .insert(plan)
                .select()
                .single()
        ).pipe(map(res => res.data));
    }

    // --- Feature Catalog Methods ---

    getFeatureDefinitions(query?: { [key: string]: any }): Observable<FeatureDefinition[]> {
        let request = this.supabase.client
            .from('feature_definitions')
            .select('*');

        if (query) {
            Object.keys(query).forEach(key => {
                const value = query[key];
                if (value !== null && value !== undefined && value !== '') {
                    if (key === 'label') {
                        request = request.ilike('label', `%${value}%`);
                    } else if (key === 'data_type') {
                        request = request.eq('data_type', value);
                    }
                    // Add other specific filters here if needed
                }
            });
        }

        return from(
            request.order('label', { ascending: true })
        ).pipe(map(res => res.data || []));
    }

    createFeatureDefinition(feature: Partial<FeatureDefinition>): Observable<FeatureDefinition | null> {
        return from(
            this.supabase.client
                .from('feature_definitions')
                .insert(feature)
                .select()
                .single()
        ).pipe(map(res => res.data));
    }

    updateFeatureDefinition(id: string, feature: Partial<FeatureDefinition>): Observable<FeatureDefinition | null> {
        return from(
            this.supabase.client
                .from('feature_definitions')
                .update(feature)
                .eq('id', id)
                .select()
                .single()
        ).pipe(map(res => res.data));
    }

    deleteFeatureDefinition(id: string): Observable<boolean> {
        return from(
            this.supabase.client
                .from('feature_definitions')
                .delete()
                .eq('id', id)
        ).pipe(map(res => !res.error));
    }

    updatePlan(id: string, plan: Partial<Plan>): Observable<Plan | null> {
        return from(
            this.supabase.client
                .from('plans')
                .update(plan)
                .eq('id', id)
                .select()
                .single()
        ).pipe(map(res => res.data));
    }

    getPlanFeatures(planId: string): Observable<PlanFeature[]> {
        return from(
            this.supabase.client
                .from('plan_features')
                .select('*')
                .eq('plan_id', planId)
                .order('sequence', { ascending: true })
        ).pipe(map(res => res.data || []));
    }

    savePlanFeature(feature: Partial<PlanFeature>): Observable<PlanFeature | null> {
        return from(
            this.supabase.client
                .from('plan_features')
                .upsert(feature)
                .select()
                .single()
        ).pipe(map(res => res.data));
    }

    deletePlanFeature(id: string): Observable<boolean> {
        return from(
            this.supabase.client
                .from('plan_features')
                .delete()
                .eq('id', id)
        ).pipe(map(res => !res.error));
    }

    deletePlan(id: string): Observable<boolean> {
        return from(
            this.supabase.client
                .from('plans')
                .delete()
                .eq('id', id)
        ).pipe(map(res => !res.error));
    }

    // --- Gestión de Facturación ---

    getInvoices(): Observable<any[]> {
        return from(
            this.supabase.client
                .from('invoices')
                .select('*, client_subscriptions!subscription_id(plans(name)), clients(name), catalog_items!status_id(name)')
                .order('created_at', { ascending: false })
        ).pipe(map(res => res.data || []));
    }

    processMonthlyBilling(): Observable<boolean> {
        // En producción esto invocaría: this.supabase.functions.invoke('process-billing')
        // Por ahora simularemos éxito tras 2 segundos
        return from(new Promise<boolean>((resolve) => {
            setTimeout(() => resolve(true), 2000);
        }));
    }

    // --- Gestión de Suscripciones por Cliente ---
    assignSubscription(clientId: string, planId: string): Observable<any> {
        return from(
            this.supabase.client
                .from('client_subscriptions')
                .insert({
                    client_id: clientId,
                    plan_id: planId,
                    status_id: 7, // Activa
                    start_date: new Date().toISOString(),
                    auto_renew: true
                })
                .select()
                .single()
        ).pipe(map(res => res.data));
    }

    // --- Gestión de Clientes ---
    getClients(): Observable<Client[]> {
        return from(
            this.supabase.client
                .from('clients')
                .select(`
                    *,
                    active_subscription:client_subscriptions!client_id(
                        id,
                        plan:plans(name, price, billing_cycle),
                        status:catalog_items!status_id(name),
                        start_date,
                        end_date
                    )
                `)
                .eq('client_subscriptions.status_id', 7)
                .order('created_at', { ascending: false })
        ).pipe(map(res => res.data || []));
    }

    createClient(client: Partial<Client>): Observable<Client | null> {
        return from(
            this.supabase.client
                .from('clients')
                .insert(client)
                .select()
                .single()
        ).pipe(map(res => res.data));
    }

    updateClient(id: string, client: Partial<Client>): Observable<Client | null> {
        return from(
            this.supabase.client
                .from('clients')
                .update({ ...client, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single()
        ).pipe(map(res => res.data));
    }

    deleteClient(id: string): Observable<boolean> {
        return from(
            this.supabase.client
                .from('clients')
                .delete()
                .eq('id', id)
        ).pipe(map(res => !res.error));
    }
}
