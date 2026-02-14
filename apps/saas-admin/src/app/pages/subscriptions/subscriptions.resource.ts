
import { BaseResource } from "../../core/base/base.resource";

export class SubscriptionsResource extends BaseResource {
    protected pantalla = [
        {
            countryCode: ['CO', 'EC', 'PE'],
            screens: {
                scr_title: "Suscripciones Activas",
                scr_description: "Listado de todas las suscripciones actualmente activas en la plataforma.",
                scr_action_label: "Nueva Suscripción", // Optional, maybe for manual override
                scr_table_columns: [
                    {
                        col_name: "Cliente",
                        col_ref: "client",
                        is_filter_parameter: true,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "auto",
                        is_mandatory: true,
                        is_mandatory_message: ""
                    },
                    {
                        col_name: "Plan",
                        col_ref: "plan",
                        is_filter_parameter: true,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "150px",
                        is_mandatory: true,
                        is_mandatory_message: ""
                    },
                    {
                        col_name: "Ciclo",
                        col_ref: "billing_cycle",
                        is_filter_parameter: true,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "120px",
                        is_mandatory: true,
                        is_mandatory_message: ""
                    },
                    {
                        col_name: "Precio",
                        col_ref: "price",
                        is_filter_parameter: false,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "120px",
                        is_mandatory: true,
                        is_mandatory_message: ""
                    },
                    {
                        col_name: "Estado",
                        col_ref: "status",
                        is_filter_parameter: true,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "120px",
                        is_mandatory: true,
                        is_mandatory_message: ""
                    },
                    {
                        col_name: "Fecha Inicio",
                        col_ref: "start_date",
                        is_filter_parameter: false,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "150px",
                        is_mandatory: true,
                        is_mandatory_message: ""
                    },
                    {
                        col_name: "Acciones",
                        col_ref: "actions",
                        is_filter_parameter: false,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "100px",
                        is_mandatory: false,
                        is_mandatory_message: ""
                    }
                ]
            }
        }
    ];
}
