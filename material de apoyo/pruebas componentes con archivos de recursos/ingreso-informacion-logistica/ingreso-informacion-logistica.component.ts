import { ChangeDetectorRef, Component } from "@angular/core";
import { AlertService } from "@core/services/general/alert/alert.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { DataManagerService } from "@core/services/general/data-manager/data-manager.service";
import { IngresoInformacionLogisticaResource } from "./ingreso-informacion-logistica.resource";
import { StorageService } from "src/app/core/services/storage.service";
import { BaseComponent } from "../base/base.component";
import { InformacionLogisticaModel } from "@core/models/parametrizacion/ingreso-informacion-logistica/ingreso-informacion-logistica";
import { IngresoInformacionLogisticaService } from "./ingreso-informacion-logistica.service";
import { IngresoInformacionLogisticaDetalleComponent } from "./ingreso-informacion-logistica-detalle/ingreso-informacion-logistica-detalle.component";

@Component({
  selector: "app-ingreso-informacion-logistica",
  templateUrl: "./ingreso-informacion-logistica.component.html",
  styleUrls: ["./ingreso-informacion-logistica.component.css"],
})
export class IngresoInformacionLogisticaComponent extends BaseComponent<InformacionLogisticaModel> {
  constructor(
    storage: StorageService,
    _service: IngresoInformacionLogisticaService,
    _resource: IngresoInformacionLogisticaResource,
    _alertService: AlertService,
    dataMngServ: DataManagerService,
    private modalService: NzModalService,
    private cdr: ChangeDetectorRef,
  ) {
    super(storage, _service, _resource, _alertService, dataMngServ);
  }

  public openModalDetalle(id: number): void {
    const isEditing = id !== 0;
    const modalData = isEditing ? this.editCache[id].data : undefined;

    const modal = this.modalService.create({
      nzTitle: this.pantalla.scr_modal_detalle_title,
      nzWrapClassName: "modal-information",
      nzFooter: null,
      nzContent: IngresoInformacionLogisticaDetalleComponent,
      nzWidth: "1600px",
      nzStyle: { top: "10px", "max-height": "200px" },
      nzData: {
        modalData
      },
    });

    modal.afterClose.subscribe((res) => {
      this.onReset();
      this.disableAdd = false;
      this.disableButtons("", false);
    });
  }
/*
{
  col_name: "Cobrar a",
  col_ref: "Entidad.cli_bill",
  is_filter_parameter: false,
  is_visible: false,
  is_visible_column: true,
  is_mandatory: true,
  is_mandatory_message: "Debe ingresar Cliente",
  col_width: "120px",
  boolean_label_affirmative: null,
  boolean_label_negative: null,
  func_to_execute: "calcularC",
  pipe_to_apply: "number:'1.2-2'",
}

  calcularC(_value: any, row: any, column: any): number {
    const a = Number(row['cli_codigo'] ?? 0);
    const b = Number(row['cli_secuencia_entrega'] ?? 0);
    return a * (b+2); // ejemplo: multiplicación
  }
*/
  segundosAHora(_value: any, row: any, column: any): string { // En este caso ocupamos el value que es el que se muestra en la tabla, pero también se pueden usar los datos de la fila completa (row) o las propiedades de la columna (column)
    const segundos = Number(_value) ?? 0;
    console.log(segundos);
    
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);

    const hh = horas.toString().padStart(2, '0');
    const mm = minutos.toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }

}
