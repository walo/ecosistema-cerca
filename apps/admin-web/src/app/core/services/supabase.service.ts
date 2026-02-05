import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { from, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }

    get client() {
        return this.supabase;
    }

    /**
     * Invoca una Edge Function de Supabase
     * @param functionName Nombre de la función
     * @param body Cuerpo de la petición (JSON)
     * @param options Opciones adicionales (headers, etc)
     */
    invokeFunction(functionName: string, body: any = {}, options: { headers?: { [key: string]: string } } = {}): Observable<any> {
        return from(this.supabase.functions.invoke(functionName, {
            body,
            headers: options.headers
        }));
    }
}
