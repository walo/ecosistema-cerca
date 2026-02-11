import { Observable } from "rxjs";
import { BaseQuery, BaseResponse, BaseExportQuery, BaseUploadQuery } from "./base.model";

export abstract class BaseService<T> {

    abstract Consultar(query: BaseQuery<T> | any): Observable<BaseResponse<T>>;

    abstract Insertar(entidad: T): Observable<BaseResponse<T>>;

    abstract Actualizar(entidad: T): Observable<BaseResponse<T>>;

    abstract Eliminar(id: any): Observable<BaseResponse<T>>;

    /**
     * Método para exportar datos. 
     * Puede ser abstracto si cada servicio implementa su endpoint,
     * o concreto si hay un endpoint genérico (poco común en frontend estricto).
     * Lo definimos abstracto para forzar implementación.
     */
    abstract Exportar(query: BaseExportQuery<T>): Observable<Blob>;

    /**
     * Método para importar datos masivos.
     */
    abstract Importar(body: FormData): Observable<BaseResponse<T>>;
}
