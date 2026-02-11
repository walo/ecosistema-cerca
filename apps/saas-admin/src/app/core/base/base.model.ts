export interface BaseColumns {
    col_name: string;
    col_ref: string;
    is_filter_parameter: boolean;
    is_visible: boolean;
    is_visible_column: boolean;
    is_mandatory: boolean;
    is_mandatory_message: string | null;
    col_width: string;
    boolean_label_affirmative?: string | null;
    boolean_label_negative?: string | null;
    func_to_execute?: string;
    pipe_to_apply?: string;
}

export interface BaseQuery<T> {
    pageNumber: number;
    pageSize: number;
    [key: string]: any;
}

export interface BaseExportQuery<T> {
    exportType: string;
    total: number;
    columns: BaseColumns[];
    entidad: { [key: string]: any };
    usu_name: string;
    zona_horaria: string;
    emp_cantidad_decimales?: number;
}

export interface BaseUploadQuery {
    emp_codigo: number;
    usu_name: string;
    len_cultura: string;
    columns: BaseColumns[];
    usuario: string;
    zona_horaria: string;
}

export interface BaseResponse<T> {
    responseMessage: string;
    resultadoConsulta?: BaseResult<T>;
    totalRegistros: number;
    totalPaginas: number;
}

export interface BaseResult<T> {
    reportes: T[];
    resultadoCargue?: BaseResultadoCargue<T>[];
}

export interface BaseResultadoCargue<T> {
    resultadoValidacion: string;
    entidad: T;
    [key: string]: any;
}

export interface ContainerActionConfig {
    topControls?: {
        clear?: boolean;
        export?: boolean;
        import?: boolean;
        add?: boolean;
        templates?: boolean;
        update?: boolean;
        templatesUrl?: { url: string; name: string }[];
    };
    showBottom?: boolean;
}
