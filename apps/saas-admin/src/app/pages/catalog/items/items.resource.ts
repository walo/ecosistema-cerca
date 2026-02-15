import { BaseResource } from "../../../core/base/base.resource";

export class ItemsResource extends BaseResource {
    protected pantalla = [
        {
            countryCode: ['CO', 'EC', 'PE'],
            screens: {
                scr_title: "Ítems de Catálogo",
                scr_description: "Administra los valores individuales del catálogo.",
                scr_action_label: "Nuevo Ítem",
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
                        col_name: "Categoría",
                        col_ref: "category.name",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "150px"
                    },
                    {
                        col_name: "Orden",
                        col_ref: "sort_order",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "80px"
                    },
                    {
                        col_name: "Estado",
                        col_ref: "is_active",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "100px"
                    }
                ]
            }
        }
    ];
}
