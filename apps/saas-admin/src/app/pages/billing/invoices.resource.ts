import { BaseResource } from "../../core/base/base.resource";

export class InvoicesResource extends BaseResource {
    protected pantalla = [
        {
            countryCode: ['CO', 'EC', 'PE'],
            screens: {
                scr_title: "Facturación y Recaudo",
                scr_description: "Gestión de facturas generadas por el sistema.",
                scr_action_label: "Generar Facturación Masiva",
                scr_table_columns: [
                    {
                        col_name: "Referencia / No.",
                        col_ref: "invoice_number",
                        is_filter_parameter: true,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "auto",
                        is_mandatory: true,
                        is_mandatory_message: "El número de factura es obligatorio"
                    },
                    {
                        col_name: "Entidad / Cliente",
                        col_ref: "client_name",
                        is_filter_parameter: true,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "auto",
                        is_mandatory: true,
                        is_mandatory_message: "El cliente es obligatorio"
                    },
                    {
                        col_name: "Importe",
                        col_ref: "total_amount",
                        is_filter_parameter: false,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "auto",
                        is_mandatory: true,
                        is_mandatory_message: "El importe es obligatorio"
                    },
                    {
                        col_name: "Vencimiento",
                        col_ref: "due_date",
                        is_filter_parameter: false,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "auto",
                        is_mandatory: true,
                        is_mandatory_message: "La fecha de vencimiento es obligatoria"
                    },
                    {
                        col_name: "Certificación",
                        col_ref: "status_id",
                        is_filter_parameter: true,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "150px",
                        is_mandatory: true,
                        is_mandatory_message: "El estado es obligatorio"
                    }
                ]
            }
        }
    ];
}
