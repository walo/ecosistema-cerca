import { BaseColumns } from "./base.model";

export abstract class BaseResource {
    protected abstract pantalla: any[];

    getPantalla(pais: string): any {
        const data = this.pantalla.find((x: any) =>
            x.countryCode.includes(pais)
        );
        return data ? data.screens : {};
    }

    getExcelTitles(pais: string): string[] {
        const pantalla = this.getPantalla(pais);
        if (!pantalla || !pantalla.scr_table_columns) return [];

        // Filtramos columnas visibles para el excel (o todas si así se requiere)
        // En la implementación de referencia se usan todas las col_name
        return pantalla.scr_table_columns.map((c: BaseColumns) => c.col_name);
    }

    getColumns(pais: string): BaseColumns[] {
        const pantalla = this.getPantalla(pais);
        return pantalla ? pantalla.scr_table_columns : [];
    }

    getColumnsImport(pais: string): BaseColumns[] {
        const pantalla = this.getPantalla(pais);
        // Asumimos que para importar se usan las mismas o se filtra
        // En el ejemplo de referencia, getColumnsImport existe. 
        // Si no hay distinción lógica, retornamos las mismas.
        return pantalla ? pantalla.scr_table_columns : [];
    }
}
