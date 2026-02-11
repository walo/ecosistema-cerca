import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BaseExportQuery,
  BaseHttpResponse,
} from '@core/models/parametrizacion/base/base.model';
import { GlobalService } from '@core/services/globalService';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseService<T> {
  endpoint: string = '';
  constructor(public http: HttpClient, public service: GlobalService) {}

  Consultar(_query: any): Observable<BaseHttpResponse<T>> {
    throw new Error('Bad Base Injection');
  }

  public ConsultarBase(payload: any, path: string = 'Consultar'): Observable<BaseHttpResponse<T>> {
    const params = this.buildParams(payload);

    return this.http.get<BaseHttpResponse<T>>(this.endpoint + path, {
      headers: this.service.headersAuthorization(),
      params: params,
    });
  }

  Importar(_formdata: FormData): Observable<BaseHttpResponse<T>> {
    throw new Error('Bad Base Injection');
  }

  public ImportarBase(formdata: FormData, path: string = 'Importar'): Observable<BaseHttpResponse<T>> {
    return this.http.post<BaseHttpResponse<T>>(
      this.endpoint + path,
      formdata,
      {
        headers: this.service.headersAuthorizationFile(),
      }
    );
  }

  Eliminar(_payload: any): Observable<BaseHttpResponse<T>> {
    throw new Error('Bad Base Injection');
  }

  public EliminarBase(payload: any, path: string = 'Eliminar'): Observable<BaseHttpResponse<T>> {
    const params = this.buildParams(payload, true);
    return this.http.delete<BaseHttpResponse<T>>(this.endpoint + path, {
      headers: this.service.headersAuthorization(),
      params: params,
    });
  }

  Insertar(_body: any): Observable<BaseHttpResponse<T>> {
    throw new Error('Bad Base Injection');
  }

  public InsertarBase(body: any, path: string = 'Insertar'): Observable<BaseHttpResponse<T>> {
    return this.http.post<BaseHttpResponse<T>>(
      this.endpoint + path,
      body,
      {
        headers: this.service.headersAuthorization(),
      }
    );
  }

  Actualizar(_body: any): Observable<BaseHttpResponse<T>> {
    throw new Error('Bad Base Injection');
  }

  public ActualizarBase(body: any, path: string = 'Actualizar'): Observable<BaseHttpResponse<T>> {
    return this.http.put<BaseHttpResponse<T>>(
      this.endpoint + path,
      body,
      {
        headers: this.service.headersAuthorization(),
      }
    );
  }

  Exportar(_body: BaseExportQuery<T>): Observable<BaseHttpResponse<T>> {
    throw new Error('Bad Base Injection');
  }

  public ExportarBase(
    body: BaseExportQuery<T>
  ): Observable<BaseHttpResponse<T>> {
    return this.http.post<BaseHttpResponse<T>>(
      this.endpoint + 'Exportar',
      body,
      {
        headers: this.service.headersAuthorization(),
        responseType: 'blob' as 'json',
      }
    );
  }

  private buildParams(payload: any, isEntidad: boolean = false): HttpParams {
    let params = new HttpParams();
    for (const key of Object.keys(payload)) {      
      const value = payload[key];
      if (value !== null && value !== undefined && value !== '') {
        if (isEntidad) {
          params = params.append('Entidad.' + key, value);
          continue;
        }
        params = params.append(key, value);
      }
    }
    return params;
  }
}
