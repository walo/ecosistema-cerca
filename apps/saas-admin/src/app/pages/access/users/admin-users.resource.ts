import { BaseResource } from "../../../core/base/base.resource";

export class AdminUsersResource extends BaseResource {
    protected pantalla = [
        {
            countryCode: ['CO', 'EC', 'PE'],
            screens: {
                scr_title: "Administradores",
                scr_description: "Gestiona los usuarios con acceso al panel administrativo.",
                scr_action_label: "", // No create button for now, or "Invitar" if implemented
                scr_table_columns: [
                    {
                        col_name: "ID Usuario",
                        col_ref: "user_id",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "300px"
                    },
                    {
                        col_name: "Rol",
                        col_ref: "role",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "150px"
                    },
                    {
                        col_name: "Fecha Creación",
                        col_ref: "created_at",
                        is_visible: true,
                        is_visible_column: true,
                        col_width: "200px"
                    }
                ]
            }
        }
    ];
}
