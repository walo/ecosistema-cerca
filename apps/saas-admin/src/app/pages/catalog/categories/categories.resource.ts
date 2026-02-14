import { BaseResource } from "../../../core/base/base.resource";

export class CategoriesResource extends BaseResource {
    protected pantalla = [
        {
            countryCode: ['CO', 'EC', 'PE'],
            screens: {
                scr_title: "Categorías de Catálogo",
                scr_description: "Gestiona las categorías maestras para agrupar ítems.",
                scr_action_label: "Nueva Categoría",
                scr_table_columns: [
                    {
                        col_name: "Nombre",
                        col_ref: "name",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "200px"
                    },
                    {
                        col_name: "Código",
                        col_ref: "code",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "150px"
                    },
                    {
                        col_name: "Descripción",
                        col_ref: "description",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "auto"
                    }
                ]
            }
        }
    ];
}
