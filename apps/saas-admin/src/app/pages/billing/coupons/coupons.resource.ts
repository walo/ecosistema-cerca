import { BaseResource } from "../../../core/base/base.resource";

export class CouponsResource extends BaseResource {
    protected pantalla = [
        {
            countryCode: ['CO', 'EC', 'PE'],
            screens: {
                scr_title: "Cupones de Descuento",
                scr_description: "Administra los códigos promocionales y sus reglas.",
                scr_action_label: "Nuevo Cupón",
                scr_table_columns: [
                    {
                        col_name: "Código",
                        col_ref: "code",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "150px"
                    },
                    {
                        col_name: "Tipo",
                        col_ref: "discount_type",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "120px"
                    },
                    {
                        col_name: "Valor",
                        col_ref: "discount_value",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "100px"
                    },
                    {
                        col_name: "Válido Desde",
                        col_ref: "valid_from",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "120px"
                    },
                    {
                        col_name: "Válido Hasta",
                        col_ref: "valid_until",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "120px"
                    },
                    {
                        col_name: "Redimidos",
                        col_ref: "current_redemptions",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "100px"
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
