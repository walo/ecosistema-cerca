import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { BaseService } from "../../core/base/base.service";
import { BaseResponse, BaseQuery, BaseExportQuery } from "../../core/base/base.model";
import { DummyEntity } from "./dummy.resource";
import * as XLSX from "xlsx";

@Injectable({
    providedIn: "root",
})
export class DummyService extends BaseService<DummyEntity> {

    private mockData: DummyEntity[] = [
        { id: 1, name: "Juan Perez", email: "juan@test.com", isActive: true, role: "Admin" },
        { id: 2, name: "Maria Gomez", email: "maria@test.com", isActive: false, role: "User" },
        { id: 3, name: "Carlos Lopez", email: "carlos@test.com", isActive: true, role: "Manager" },
    ];

    Consultar(query: any): Observable<BaseResponse<DummyEntity>> {
        let data = [...this.mockData];

        // Apply filters
        if (query) {
            Object.keys(query).forEach(key => {
                if (key !== 'pageNumber' && key !== 'pageSize' && query[key]) {
                    const filterValue = query[key].toString().toLowerCase();
                    data = data.filter(item => {
                        const itemValue = (item as any)[key]?.toString().toLowerCase();
                        return itemValue && itemValue.includes(filterValue);
                    });
                }
            });
        }

        const total = data.length;
        const pageIndex = query.pageNumber || 1;
        const pageSize = query.pageSize || 10;

        // Pagination
        const start = (pageIndex - 1) * pageSize;
        const end = start + pageSize;
        const paginatedData = data.slice(start, end);

        const response: BaseResponse<DummyEntity> = {
            responseMessage: "Success",
            totalRegistros: total,
            totalPaginas: Math.ceil(total / pageSize),
            resultadoConsulta: {
                reportes: paginatedData
            }
        };
        return of(response);
    }

    Insertar(entidad: DummyEntity): Observable<BaseResponse<DummyEntity>> {
        entidad.id = this.mockData.length + 1;
        this.mockData.push(entidad);
        return of({ responseMessage: "Creado", totalRegistros: 1, totalPaginas: 1 });
    }

    Actualizar(entidad: DummyEntity): Observable<BaseResponse<DummyEntity>> {
        return of({ responseMessage: "Actualizado", totalRegistros: 1, totalPaginas: 1 });
    }

    Eliminar(id: any): Observable<BaseResponse<DummyEntity>> {
        return of({ responseMessage: "Eliminado", totalRegistros: 1, totalPaginas: 1 });
    }

    Exportar(query: BaseExportQuery<DummyEntity>): Observable<Blob> {
        const worksheet = XLSX.utils.json_to_sheet(this.mockData);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        return of(blob);
    }

    Importar(body: FormData): Observable<BaseResponse<DummyEntity>> {
        return of({ responseMessage: "Importado", totalRegistros: 1, totalPaginas: 1 });
    }
}
