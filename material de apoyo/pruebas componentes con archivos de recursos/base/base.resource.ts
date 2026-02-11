import { Injectable } from '@angular/core';
import { BaseColumns } from '@core/models/parametrizacion/base/base.model';
import { Pantalla } from 'src/app/core/models/pantallas.model';

@Injectable({
  providedIn: 'root',
})
export class BaseResource {
  public pantalla: any[] = [];
  public mensajes_genericos: any[] = [
    {
      countryCode: [
        'CO',
        'US',
        'DO',
        'EC',
        'GT',
        'HN',
        'HT',
        'MX',
        'NI',
        'PE',
        'SV',
        'VE',
        'VG',
      ],
      screens: {
        scr_messages_generic_base: {
          msg_create_succes: 'El registro fue insertado correctamente.',
          msg_create_error:
            'Ocurrió un error al intentar insertar el registro.',
          msg_update_succes: 'El registro fue actualizado correctamente.',
          msg_update_error:
            'Ocurrió un error al intentar actualizar el registro.',
          msg_delete_succes: 'El registro fue eliminado correctamente.',
          msg_delete_error:
            'Ocurrió un error al intentar eliminar el registro.',
          msg_import_succes: 'El archivo fue procesado correctamente.',
          msg_import_error:
            'Ocurrió un error insertando masivamente, se generó un archivo Excel con los errores de validación.',
          msg_export_info: 'Generando Archivo...',
          msg_export_message_succes: 'Archivo descargado!',
          msg_export_message_error: 'No hay datos con el filtro seleccionado',
          msg_service_error: 'No se puede establecer una conexión al servicio',
        },
      },
    },
  ];

  public getPantalla(country: string): Pantalla {
    const pantalla = this.pantalla.find((x) =>
      x.countryCode.includes(country)
    )?.screens;

    const mensajesGenericos = this.mensajes_genericos.find((x) =>
      x.countryCode.includes(country)
    )?.screens;

    return { ...pantalla, ...mensajesGenericos };
  }

  public getExcelTitles(country: string): string[] {
    const screen = this.pantalla!.find((x) =>
      x.countryCode.includes(country)
    )?.screens;
    return [
      screen.scr_table_columns
        .filter(
          (col: any) => col.is_import === true || col.is_import === undefined
        )
        .map((col: any) => {
          if (col.is_mandatory) {
            return `${col.col_name} *`;
          }
          return col.col_name;
        }),
    ];
  }

  public getColumns(country: string): BaseColumns[] {
    const screen = this.pantalla!.find((x) =>
      x.countryCode.includes(country)
    )!.screens;
    return screen.scr_table_columns.map((x: any) => ({
      col_ref: x.col_ref.replace('Entidad.', ''),
      col_name: x.col_name,
      is_mandatory: x.is_mandatory,
      boolean_label_affirmative: x.boolean_label_affirmative,
      boolean_label_negative: x.boolean_label_negative,
      is_mandatory_message: x.is_mandatory_message,
    }));
  }

  public getColumnsImport(country: string): BaseColumns[] {
    const screen = this.pantalla!.find((x) =>
      x.countryCode.includes(country)
    )!.screens;
    return screen.scr_table_columns
      .filter(
        (col: any) => col.is_import === true || col.is_import === undefined
      )
      .map((x: any) => ({
        col_ref: x.col_ref.replace('Entidad.', ''),
        col_name: x.col_name,
        is_mandatory: x.is_mandatory,
        is_primary_key: x.is_primary_key ?? false,
        boolean_label_affirmative: x.boolean_label_affirmative,
        boolean_label_negative: x.boolean_label_negative,
        is_mandatory_message: x.is_mandatory_message,
      }));
  }
}
