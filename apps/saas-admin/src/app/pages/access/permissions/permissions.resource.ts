import { BaseResource } from "../../../core/base/base.resource";

export class PermissionsResource extends BaseResource {
    protected pantalla = [
        {
            countryCode: ['CO', 'EC', 'PE'],
            screens: {
                scr_title: "Permisos del Sistema",
                scr_description: "Define los accesos y rutas disponibles para los roles.",
                scr_action_label: "Nuevo Permiso",
                scr_table_columns: [
                    {
                        col_name: "Módulo",
                        col_ref: "module",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "150px"
                    },
                    {
                        col_name: "Acción / Opción",
                        col_ref: "option",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "150px"
                    },
                    {
                        col_name: "Ruta (Frontend)",
                        col_ref: "route",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "200px"
                    },
                    {
                        col_name: "Descripción",
                        col_ref: "description",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "auto"
                    },
                    {
                        col_name: "Estado",
                        col_ref: "status_id",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "100px"
                    }
                ]
            }
        }
    ];
}
