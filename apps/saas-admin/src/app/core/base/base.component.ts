import { Component, OnInit, Injectable, inject } from "@angular/core";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { BaseColumns, BaseExportQuery, BaseQuery, BaseResponse, ContainerActionConfig } from "./base.model";
import { BaseResource } from "./base.resource";
import { BaseService } from "./base.service";
import { AlertService } from "../services/general/alert/alert.service";
import { DataManagerService } from "../services/general/data-manager/data-manager.service";
import { TableColumn } from "../../shared/components/organisms/cerca-table/cerca-table.types";

/**
 * Componente base para gestión de tablas
 * TEntity: Tipo de la entidad principal
 */
@Component({
    template: '',
})
export abstract class BaseComponent<TEntity> implements OnInit {

    // Dependencias usando inject()
    protected _resource = inject(BaseResource);
    protected _alertService = inject(AlertService);
    protected _dataManager = inject(DataManagerService);

    // El servicio debe ser implementado por la clase hija o proveído
    protected abstract _service: BaseService<TEntity>;

    // Estado de la tabla
    loading: boolean = true;
    totalRegistros: number = 0;
    pageNumber: number = 1;
    pageSize: number = 10;
    listado: TEntity[] = [];

    // Configuración
    pantalla: any = {};
    columns: BaseColumns[] = [];
    tableColumns: TableColumn[] = []; // Columnas adaptadas para CercaTable

    // Cache de edición (si se usa edición en línea)
    editCache: { [key: string]: { edit: boolean; data: TEntity } } = {};

    // Filtros y Query
    payload: { [key: string]: any } = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
    };

    constructor() {
        // Inicialización básica
        const countryCode = 'CO'; // TODO: Obtener del contexto de usuario
        this.pantalla = this._resource.getPantalla(countryCode);
        this.columns = this._resource.getColumns(countryCode);
        this.tableColumns = this.mapColumnsToTableColumns(this.columns);
    }

    ngOnInit(): void {
        this.consultar(this.payload);
    }

    /**
     * Mapea BaseColumns a TableColumn para el componente genérico
     */
    private mapColumnsToTableColumns(baseCols: BaseColumns[]): TableColumn[] {
        return baseCols.map(col => ({
            key: col.col_ref,
            label: col.col_name,
            type: col.boolean_label_affirmative ? 'status' : 'text', // Inferencia simple
            width: col.col_width,
            // Generic filter configuration
            filter: col.is_filter_parameter ? {
                type: 'text',
                placeholder: `Buscar ${col.col_name}`,
                dropdownVisible: false,
                searchValue: ''
            } : undefined,
            statusMap: col.boolean_label_affirmative ? {
                true: 'success',
                false: 'error'
            } : undefined
        }));
    }

    /**
     * Maneja el cambio de filtros desde el componente genérico
     */
    onFilterChange(event: { key: string; value: any }): void {
        this.payload[event.key] = event.value;
        this.pageNumber = 1; // Reset page on filter
        this.payload['pageNumber'] = 1;
        this.consultar(this.payload);
    }

    /**
     * Maneja el cambio de parámetros de la tabla (paginación, ordenamiento, filtrado)
     */
    onQueryParamsChange(params: NzTableQueryParams): void {
        const { pageSize, pageIndex } = params;
        this.pageSize = pageSize;
        this.pageNumber = pageIndex;
        this.payload['pageSize'] = pageSize;
        this.payload['pageNumber'] = pageIndex;

        // Aquí se podrían mapear los filtros y ordenamiento de params a payload
        this.consultar(this.payload);
    }

    /**
     * Ejecuta la consulta al servicio
     */
    public consultar(query: BaseQuery<TEntity> | any): void {
        this.loading = true;
        this._service.Consultar(query).subscribe({
            next: (response) => {
                // Adaptar según la estructura real de respuesta
                if (response && response.resultadoConsulta && response.resultadoConsulta.reportes) {
                    this.listado = response.resultadoConsulta.reportes;
                    this.totalRegistros = response.totalRegistros;
                } else {
                    // Fallback si la estructura es diferente o es un array directo
                    this.listado = Array.isArray(response) ? response : [];
                    this.totalRegistros = this.listado.length;
                }
                this.loading = false;
                this.updateEditCache();
            },
            error: (err) => {
                this.loading = false;
                this._alertService.error('Error cargando datos');
                console.error(err);
            }
        });
    }

    /**
     * Exportar datos
     */
    onExport(exportType: string = 'xlsx'): void {
        this.loading = true;
        const body: BaseExportQuery<TEntity> = {
            exportType,
            total: this.totalRegistros,
            columns: this.columns,
            entidad: { ...this.payload }, // Enviamos filtros actuales
            usu_name: 'Usuario', // Debería venir de un AuthService
            zona_horaria: 'America/Bogota'
        };

        this._service.Exportar(body).subscribe({
            next: (blob) => {
                this._dataManager.saveAsExcelFile(blob, this.pantalla.scr_fileName_export || 'Export');
                this.loading = false;
                this._alertService.success('Exportación exitosa');
            },
            error: () => {
                this.loading = false;
                this._alertService.error('Error al exportar');
            }
        });
    }

    /**
     * Inicializa el cache de edición (para tablas editables)
     */
    updateEditCache(): void {
        this.listado.forEach((item: any) => {
            // Usamos 'id' como key, asegurarnos que la entidad tenga id
            if (item.id) {
                this.editCache[item.id] = {
                    edit: false,
                    data: { ...item },
                };
            }
        });
    }

    /**
     * Obtiene el valor de una celda dinámicamente
     */
    getCellValue(row: any, column: BaseColumns): any {
        if (!column || !column.col_ref) return '';

        const getNested = (obj: any, path: string) => {
            return path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
        };

        let value = getNested(row, column.col_ref);

        // Lógica de transformación (pipes, booleanos, funciones)
        if (typeof value === 'boolean') {
            return value
                ? (column.boolean_label_affirmative || 'Sí')
                : (column.boolean_label_negative || 'No');
        }

        // TODO: Implementar lógica de funciones dinámicas (func_to_execute) si es necesario
        // Si la columna define una función helper en el componente hijo
        if (column.func_to_execute && typeof (this as any)[column.func_to_execute] === 'function') {
            return (this as any)[column.func_to_execute](value, row, column);
        }

        return value;
    }
}
