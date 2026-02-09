import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { from, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;
    private accionaSupabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
        this.accionaSupabase = createClient(
            (environment as any).accionaSupabaseUrl,
            (environment as any).accionaSupabaseKey
        );
    }

    get client() {
        return this.supabase;
    }

    /**
     * Invoca una Edge Function en el proyecto principal (Cerca)
     */
    invokeFunction(functionName: string, body: any = {}, options: { headers?: { [key: string]: string } } = {}): Observable<any> {
        return from(this.supabase.functions.invoke(functionName, {
            body,
            headers: options.headers
        }));
    }

    /**
     * Invoca una Edge Function en el proyecto de suscripciones (Acciona)
     */
    invokeAccionaFunction(functionName: string, body: any = {}, options: { headers?: { [key: string]: string } } = {}): Observable<any> {
        return from(this.accionaSupabase.functions.invoke(functionName, {
            body,
            headers: options.headers
        }));
    }
}

