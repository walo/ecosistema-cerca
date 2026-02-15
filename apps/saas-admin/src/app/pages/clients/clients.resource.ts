import { BaseResource } from "../../core/base/base.resource";

export class ClientsResource extends BaseResource {
    protected pantalla = [
        {
            countryCode: ['CO', 'EC', 'PE'],
            screens: {
                scr_title: "Gestión de Clientes",
                scr_description: "Administra los conjuntos residenciales y sus suscripciones.",
                scr_action_label: "Nuevo Cliente",
                scr_table_columns: [
                    {
                        col_name: "Razón Social",
                        col_ref: "name",
                        is_filter_parameter: true,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "auto",
                        is_mandatory: true,
                        is_mandatory_message: "La razón social es obligatoria"
                    },
                    {
                        col_name: "Contacto",
                        col_ref: "contact_name",
                        is_filter_parameter: true,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "auto",
                        is_mandatory: false,
                        is_mandatory_message: null
                    },
                    {
                        col_name: "Email",
                        col_ref: "contact_email",
                        is_filter_parameter: true,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "auto",
                        is_mandatory: true,
                        is_mandatory_message: "El email es obligatorio"
                    },
                    {
                        col_name: "Teléfono",
                        col_ref: "contact_phone",
                        is_filter_parameter: true,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "auto",
                        is_mandatory: false,
                        is_mandatory_message: null
                    },
                    {
                        col_name: "Plan Actual",
                        col_ref: "current_plan",
                        is_filter_parameter: false,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "150px",
                        is_mandatory: false,
                        is_mandatory_message: null
                    },
                    {
                        col_name: "Estado Suscripción",
                        col_ref: "subscription_status",
                        is_filter_parameter: true,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "150px",
                        is_mandatory: false,
                        is_mandatory_message: null
                    },
                    {
                        col_name: "Estado",
                        col_ref: "status_id",
                        is_filter_parameter: true,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "120px",
                        is_mandatory: true,
                        is_mandatory_message: "El estado es obligatorio"
                    }
                ]
            }
        }
    ];
}
