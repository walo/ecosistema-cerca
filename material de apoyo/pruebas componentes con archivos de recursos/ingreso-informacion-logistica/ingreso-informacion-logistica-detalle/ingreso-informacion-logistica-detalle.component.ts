import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AlertService } from "@core/services/general/alert/alert.service";
import { NzModalService } from "ng-zorro-antd/modal";
import { StorageService } from "@core/services/storage.service";
import { NZ_MODAL_DATA } from "ng-zorro-antd/modal";
import { ContainerActionConfig } from "@core/components/container-action/container-action.model";
import {
  InformacionLogisticaModel,
  InformacionLogisticaModelReq,
} from "@core/models/parametrizacion/ingreso-informacion-logistica/ingreso-informacion-logistica";
import { InformacionLogisticaDetalleService } from "../ingreso-informacion-logistica-detalle/ingreso-informacion-logistica-detalle.service";
import { InformacionLogisticaDetalleResource } from "./ingreso-informacion-logistica-detalle.resource";
import { BaseReactiveFormComponent } from "@core/listasComponent/base-reactive-form/base-reactive-form.component";
import { ReactiveFormService } from "@core/services/form/reactive-form.service";
import { ValidatorsService } from "@core/services/validator-form/validators.service";
import { FocusService } from "@core/services/global/focus.service";
import { ChangeDetectorRef } from "@angular/core";
import { UtilClass } from "@core/libs/shared/utils/utils";

@Component({
  selector: "app-ingreso-informacion-logistica",
  templateUrl: "./ingreso-informacion-logistica-detalle.component.html",
  styleUrls: ["./ingreso-informacion-logistica-detalle.component.css"],
})
export class IngresoInformacionLogisticaDetalleComponent
  extends BaseReactiveFormComponent
  implements OnInit {
  public modalData = inject<any | undefined>(NZ_MODAL_DATA);
  public editInfoLogistica: boolean = this.modalData?.isEdit ?? false;

  get infoLogistica(): InformacionLogisticaModel | undefined {
    return this.modalData.modalData;
  }

  public listadoCaracteristicas: any[] = [
    { code: 'Consignacion', description: 'Consignacion' },
    { code: 'Contado', description: 'Contado' },
    { code: 'Directo', description: 'Directo' },
    { code: 'Normal', description: 'Normal' },
  ];
  public listadoEstados: any[] = [
    { code: false, description: 'INACTIVO' },
    { code: true, description: 'ACTIVO' },
  ];

  override configContainer: ContainerActionConfig = {
    topControls: {
      clear: true,
      add: false,
    },
    showBottom: false,
  };

  constructor(
    private fbForm: FormBuilder,
    formService: ReactiveFormService,
    validatorsService: ValidatorsService,
    focusService: FocusService,
    storage: StorageService,
    cdr: ChangeDetectorRef,
    utilClass: UtilClass,
    private modalService: NzModalService,
    private informacionLogisticaService: InformacionLogisticaDetalleService,
    private alertService: AlertService,
    _resource: InformacionLogisticaDetalleResource
  ) {
    super(
      formService,
      validatorsService,
      focusService,
      storage,
      cdr,
      fbForm,
      _resource,
      utilClass
    );
    this.setModelType(InformacionLogisticaModelReq);
    this.configContainer = {
      topControls: {
        clear: true,
        export: false,
      },
      bottomControls: {
        search: true,
        saveOnConfirm: false,
      },
    };
    this.initializeForm();
  }

  protected initializeForm(): void {
    this.form = this.fbForm.group({
      emp_codigo: [this.user.emp_codigo],
      emp_zona_horaria: [this.user.emp_zona_horaria],
      emp_cantidad_decimales: [this.user.emp_cantidad_decimales],
      usu_login: [this.user.usu_login],
      cli_codigo: [this.infoLogistica?.cli_codigo ?? "", [Validators.required, Validators.maxLength(8)],],
      cli_nombre: [{ value: this.infoLogistica?.cli_nombre ?? "", disabled: true }],
      cli_direccion1: [{ value: this.infoLogistica?.cli_direccion1 ?? "", disabled: true }],
      cli_direccion2: [{ value: this.infoLogistica?.cli_direccion2 ?? "", disabled: true }],
      cli_direccion3: [{ value: this.infoLogistica?.cli_direccion3 ?? "", disabled: true }],
      cli_telefono: [{ value: this.infoLogistica?.cli_telefono ?? "", disabled: true }],
      cli_fax: [{ value: this.infoLogistica?.cli_fax ?? "", disabled: true }],
      cli_id: [{ value: this.infoLogistica?.cli_id ?? "", disabled: true }],
      cli_pais: [{ value: this.infoLogistica?.cli_pais ?? "", disabled: true }],
      cli_departamento: [{ value: this.infoLogistica?.cli_departamento ?? "", disabled: true }],
      est_descripcion: [{ value: this.infoLogistica?.est_descripcion ?? "", disabled: true }],
      cli_postal: [{ value: this.infoLogistica?.cli_postal ?? "", disabled: true }],
      cli_ciudad: [{ value: this.infoLogistica?.cli_ciudad ?? "", disabled: true }],
      cli_municipio: [{ value: this.infoLogistica?.cli_municipio ?? "", disabled: true }],
      mun_codigo: [{ value: this.infoLogistica?.mun_codigo ?? "", disabled: true }],
      mun_descripcion: [{ value: this.infoLogistica?.mun_descripcion ?? "", disabled: true }],
      cli_bill: [{ value: this.infoLogistica?.cli_bill ?? "", disabled: true }],
      cli_cob_nombre: [{ value: this.infoLogistica?.cli_cob_nombre ?? "", disabled: true }],
      cli_barrio: [{ value: this.infoLogistica?.cli_Barrio ?? "", disabled: true }],
      cli_canal: [{ value: this.infoLogistica?.cli_canal ?? "", disabled: true }],

      rc_secuencia: [
        this.infoLogistica?.rc_secuencia ?? "",
        [Validators.maxLength(8)],
      ],
      col_descripcion: [{ value: "", disabled: true }],
      sub_codigo: [
        this.infoLogistica?.sub_codigo ?? "",
        [Validators.maxLength(8)],
      ],
      rs_descripcion_subzona: [{ value: "", disabled: true }],
      cli_hora_recibido: [this.segundosAHora(this.infoLogistica?.cli_hora_recibido ?? 0)],
      cli_area: [
        this.infoLogistica?.cli_area ?? "",
        [Validators.required, Validators.maxLength(6)],
      ],
      cli_area_descripcion: [{ value: "", disabled: true }],
      cli_transbordo: [this.infoLogistica?.cli_transbordo ?? false],
      cli_contado: [
        this.infoLogistica?.cli_contado ?? "",
        [Validators.required, Validators.maxLength(18)],
      ],
      cli_secuencia_entrega: [
        this.infoLogistica?.cli_secuencia_entrega ?? null,
        [Validators.pattern("^[0-9]*$"), Validators.maxLength(8)],
      ],
      cli_secuencia_visita: [
        this.infoLogistica?.cli_secuencia_visita ?? null,
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.maxLength(8),
        ],
      ],
      tneg_codigo: [
        this.infoLogistica?.tneg_codigo ?? "",
        [Validators.required, Validators.maxLength(8)],
      ],
      tne_descripcion: [
        this.infoLogistica?.tne_descripcion ?? "", { disabled: true }
      ],
      rut_codigo_entrega: [
        this.infoLogistica?.rut_codigo_entrega ?? "",
        [Validators.required, Validators.maxLength(8)],
      ],
      rute_descripcion: [{ value: "", disabled: true }],

      rut_codigo_visita: [
        this.infoLogistica?.rut_codigo_visita ?? "",
        [Validators.required, Validators.maxLength(8)],
      ],
      rutv_descripcion: [{ value: "", disabled: true }],
      cli_estrato: [
        this.infoLogistica?.cli_estrato ?? null,
        [Validators.pattern("^[0-9]*$"), Validators.maxLength(2)],
      ],
      cli_estado: [
        this.infoLogistica?.cli_estado ?? null, { disabled: true }],
      cli_restriccion_recibido: [
        this.infoLogistica?.cli_restriccion_recibido ?? false,
      ],
      rtv_codigo: [this.infoLogistica?.rtv_codigo ?? ""],
      rtv_descripcion: [{
        value: this.infoLogistica?.rtv_descripcion ?? "", disabled: true
      }],
      cli_horario_cargue: [
        this.infoLogistica?.cli_horario_cargue ?? "",
        [Validators.maxLength(35)],
      ],
      mun_area_nielsen: [
        this.infoLogistica?.mun_area_nielsen ?? "",
        [Validators.maxLength(14)],
      ],
      cli_um_maniobra_descargue: [
        this.infoLogistica?.cli_um_maniobra_descargue ?? "",
      ],
      cli_tarifa_maniobra: [
        this.infoLogistica?.cli_tarifa_maniobra ?? "",
      ],
      cli_observaciones: [
        this.infoLogistica?.cli_observaciones ?? "",
        [Validators.maxLength(30)],
      ],
      rvent_codigo: [
        this.infoLogistica?.rvent_codigo ?? 0,
        [Validators.maxLength(10)],
      ],
      ilg_ventana_horaria_descripcion: [{ value: "", disabled: true }],
    });
  }
  ngOnInit(): void {
    this.initializeForm();
    this.onClear();
  }

  public onClear() {
  }

  public handleModal(
    event: any,
    controlsNames: string[],
    fieldsEvent: string[],
    indexNavigate: number
  ) {
    if (this.utilClass.hasValue(event)) {
      for (let index = 0; index < controlsNames.length; index++) {
        if (controlsNames[index] === "ilg_ventana_horaria_descripcion") {
          this.form
            .get(controlsNames[index])
            ?.setValue(
              event[fieldsEvent[index]] + " A: " + event[fieldsEvent[index + 1]]
            );
        } else if (controlsNames[index] === "cli_codigo") {
          let value = event[fieldsEvent[index]] ?? "";
          this.form.get("cli_codigo")?.setValue(value);
          this.llenarDatosCliente(event);
        } else {
          let value = event[fieldsEvent[index]]
            ? event[fieldsEvent[index]]
            : "";
          this.form.get(controlsNames[index])?.setValue(value);
        }
      }
      this.setFocus(indexNavigate + 2);
    }
  }

  public onGuardar(): void {
    this.utilClass.alertaConfirmacionSiNo(
      this.resource.scr_labels![46].label_name,
      this.utilClass.format(this.resource.scr_labels![47].label_name, this.form.get("cli_codigo")?.value ?? ""),
      this.resource.scr_labels![48].label_name,
      'primary',
      this.resource.scr_labels![49].label_name,
    ).then((resp) => {
      const model = this.form.getRawValue();
      this.editarInfoLogistica(model);
    });
  }

  public insertarInfoLogistica(data: any) {
    data.ilg_hora_recibido = `${data.ilg_hora_recibido}:00`;
    data.ilg_ventana_horaria = `${data.ilg_ventana_horaria}`;
    this.informacionLogisticaService
      .Insertar(data)
      .subscribe((res) => {
        if (res) {
          this.alertService.error(this.resource.scr_messages![5].message, 10000);
        }
        else {
          this.alertService.error(this.resource.scr_messages![9].message, 10000);
        }
      });
  }

  public editarInfoLogistica(data: any) {
    data.cli_hora_recibido = this.horasASegundos(this.form.get('cli_hora_recibido')!.value);
    this.informacionLogisticaService
      .Actualizar(data)
      .subscribe({
        next: (response) => {
          if (response) {
            this.alertService.success(this.resource.scr_messages![4].message, 10000);
            this.modalService.closeAll();
          }
        },
        error: (err) => {
          this.alertService.error(this.resource.scr_messages![9].message, 10000);
          this.modalService.closeAll();
        }
      });
  }



  public onVolver(): void {
    this.modalService.closeAll();
  }

  public llenarDatosCliente(cliente: any) {
    this.form.patchValue({
      cli_nombre: cliente.cli_nombre,
      cli_bill: cliente.cli_bill,
      cli_cob_nombre: cliente.cli_cob_nombre,
      cli_canal: cliente.cli_canal,
      cli_direccion1: cliente.cli_direccion1,
      cli_direccion2: cliente.cli_direccion2,
      cli_direccion3: cliente.cli_direccion3,
      cli_telefono: cliente.cli_telefono,
      cli_fax: cliente.cli_fax,
      cli_id: cliente.cli_id,
      cli_pais: cliente.cli_pais,
      cli_departamento: cliente.cli_departamento,
      est_descripcion: cliente.est_descripcion,
      cli_postal: cliente.cli_postal,
      cli_ciudad: cliente.cli_ciudad,
      cli_municipio: cliente.cli_municipio,
      mun_codigo: cliente.mun_codigo,
      mun_descripcion: cliente.mun_descripcion,
      cli_Barrio: cliente.barrio,
      sub_codigo: cliente.sub_codigo,
      rs_descripcion_subzona: cliente.rs_descripcion_subzona,
      cli_hora_recibido: cliente.cli_hora_recibido,
      cli_area: cliente.cli_area,
      cli_transbordo: cliente.cli_transbordo,
      cli_contado: cliente.cli_contado,
      rc_secuencia: cliente.rc_secuencia,
      col_descripcion: cliente.col_descripcion,
      cli_estrato: cliente.cli_estrato,
      cli_estado: cliente.cli_estado,
      tneg_codigo: cliente.tneg_codigo,
      tne_descripcion: cliente.tne_descripcion,
      rut_codigo_entrega: cliente.rut_codigo_entrega,
      rute_descripcion: cliente.rute_descripcion,
      rut_codigo_visita: cliente.rut_codigo_visita,
      rutv_descripcion: cliente.rutv_descripcion,
      cli_secuencia_entrega: cliente.cli_secuencia_entrega,
      cli_secuencia_visita: cliente.cli_secuencia_visita,
      mun_area_nielsen: cliente.mun_area_nielsen,
      rtv_codigo: cliente.rtv_codigo,
      rtv_descripcion: cliente.rtv_descripcion,
      cli_tarifa_maniobra: cliente.cli_tarifa_maniobra,
      cli_um_maniobra_descargue: cliente.cli_um_maniobra_descargue,
      cli_observaciones: cliente.cli_observaciones,
    });
    this.cdr.detectChanges();
  }

  onInput(event: any) {
    let input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '').slice(0, 4);
    if (value.length >= 3) {
      value = value.slice(0, 2) + ':' + value.slice(2, 4);
    }
    else if (value.length >= 1 && value.length <= 2) {
      value = value;
    }
    this.setValue("cli_hora_recibido", value);
  }

  segundosAHora(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);

    const hh = horas.toString().padStart(2, '0');
    const mm = minutos.toString().padStart(2, '0');

    return `${hh}:${mm}`;
  }

  horasASegundos(hora: string): number {
    const [hh, mm] = hora.split(':').map(Number);
    return hh * 3600 + mm * 60;
  }

}
