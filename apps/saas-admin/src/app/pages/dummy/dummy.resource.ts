import { Injectable } from "@angular/core";
import { BaseResource } from "../../core/base/base.resource";

export interface DummyEntity {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
    role: string;
}

@Injectable({
    providedIn: "root",
})
export class DummyResource extends BaseResource {
    override pantalla: any[] = [
        {
            countryCode: ["CO", "US"],
            screens: {
                scr_title: "Dummy Table Verification",
                scr_fileName_export: "Dummy Export",
                scr_table_columns: [
                    {
                        col_name: "ID",
                        col_ref: "id",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "50px"
                    },
                    {
                        col_name: "Nombre",
                        col_ref: "name",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "150px",
                        is_filter_parameter: true
                    },
                    {
                        col_name: "Correo",
                        col_ref: "email",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "200px",
                        is_filter_parameter: true
                    },
                    {
                        col_name: "Activo",
                        col_ref: "isActive",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "100px",
                        boolean_label_affirmative: "Activo",
                        boolean_label_negative: "Inactivo"
                    },
                    {
                        col_name: "Rol",
                        col_ref: "role",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "100px"
                    },
                    {
                        col_name: "Acción Custom",
                        col_ref: "id", // Usamos ID para el boton
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "100px",
                        func_to_execute: "customAction" // Probamos funcion dinamica
                    }
                ]
            }
        }
    ];
}
