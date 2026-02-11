import { BaseResource } from "../../core/base/base.resource";

export class SubscriptionAuditResource extends BaseResource {
    protected pantalla = [
        {
            countryCode: ['CO', 'EC', 'PE'],
            screens: {
                scr_title: "Auditoría de Suscripciones",
                scr_description: "Historial de cambios y actualizaciones en las suscripciones.",
                scr_action_label: "", // No action needed or maybe "Export"
                scr_table_columns: [
                    {
                        col_name: "Fecha",
                        col_ref: "created_at",
                        is_filter_parameter: false,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "200px",
                        is_mandatory: true,
                        is_mandatory_message: "La fecha es obligatoria"
                    },
                    {
                        col_name: "Tipo de Cambio",
                        col_ref: "change_type",
                        is_filter_parameter: true,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "200px",
                        is_mandatory: true,
                        is_mandatory_message: "El tipo es obligatorio"
                    },
                    {
                        col_name: "Notas",
                        col_ref: "notes",
                        is_filter_parameter: true,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "auto",
                        is_mandatory: false,
                        is_mandatory_message: ""
                    }
                ]
            }
        }
    ];
}
