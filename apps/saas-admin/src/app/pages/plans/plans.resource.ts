import { BaseResource } from "../../core/base/base.resource";

export class PlansResource extends BaseResource {
    protected pantalla = [
        {
            countryCode: ['CO', 'EC', 'PE'],
            screens: {
                scr_title: "Planes de Suscripción",
                scr_description: "Administra los niveles de servicio y precios para los conjuntos residenciales.",
                scr_action_label: "Nuevo Plan",
                scr_table_columns: [] // No columns implementation needed as it uses cards currently
            }
        }
    ];
}
