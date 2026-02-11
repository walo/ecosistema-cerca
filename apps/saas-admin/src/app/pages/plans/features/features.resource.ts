import { BaseResource } from "../../../core/base/base.resource";
import { BaseColumns } from "../../../core/base/base.model";

export class FeaturesResource extends BaseResource {
    protected pantalla = [
        {
            countryCode: ['CO', 'EC', 'PE'],
            screens: {
                scr_title: "Catálogo de Características",
                scr_description: "Define las funcionalidades y límites disponibles para los planes.",
                scr_action_label: "Nueva Característica",
                scr_table_columns: [
                    {
                        col_name: "Nombre / Etiqueta",
                        col_ref: "label",
                        is_filter_parameter: true,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "auto",
                        is_mandatory: true,
                        is_mandatory_message: "El nombre es obligatorio"
                    },
                    {
                        col_name: "Clave (Key)",
                        col_ref: "key",
                        is_filter_parameter: false,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "200px",
                        is_mandatory: true,
                        is_mandatory_message: "La clave es obligatoria"
                    },
                    {
                        col_name: "Tipo de Dato",
                        col_ref: "data_type",
                        is_filter_parameter: true,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "180px",
                        is_mandatory: true,
                        is_mandatory_message: null
                    },
                    {
                        col_name: "Descripción",
                        col_ref: "description",
                        is_filter_parameter: false,
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "auto",
                        is_mandatory: false,
                        is_mandatory_message: null
                    }
                ]
            }
        }
    ];
}
