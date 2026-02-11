import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "@core/services/config.service";
import { GlobalService } from "@core/services/globalService";
import { BaseService } from "../base/base.service";
import {
  BaseExportQuery,
  BaseHttpResponse,
} from "@core/models/parametrizacion/base/base.model";
import { Observable } from "rxjs";
import { InformacionLogisticaModel } from "@core/models/parametrizacion/ingreso-informacion-logistica/ingreso-informacion-logistica";

@Injectable({
  providedIn: "root",
})
export class IngresoInformacionLogisticaService extends BaseService<InformacionLogisticaModel> {
  constructor(
    http: HttpClient,
    configService: ConfigService,
    service: GlobalService
  ) {
    super(http, service);
    //this.endpoint = `${configService.createRouteApi(configService.variables.API_PARAMETROS)}/api/InformacionLogistica`;
    this.endpoint = configService.variables.API_PARAMETROS_URL + `/api/InformacionLogistica/`;
  }

  override Consultar(
    payload: any
  ): Observable<BaseHttpResponse<InformacionLogisticaModel>> {
    return this.ConsultarBase(payload);
  }

  override Importar(
    formdata: FormData
  ): Observable<BaseHttpResponse<InformacionLogisticaModel>> {
    return this.ImportarBase(formdata);
  }

  override Eliminar(
    payload: any
  ): Observable<BaseHttpResponse<InformacionLogisticaModel>> {
    return this.EliminarBase(payload);
  }

  override Insertar(
    body: any
  ): Observable<BaseHttpResponse<InformacionLogisticaModel>> {
    return this.InsertarBase(body);
  }

  override Actualizar(
    body: any
  ): Observable<BaseHttpResponse<InformacionLogisticaModel>> {
    return this.ActualizarBase(body);
  }

  override Exportar(
    body: BaseExportQuery<InformacionLogisticaModel>
  ): Observable<BaseHttpResponse<InformacionLogisticaModel>> {
    return this.ExportarBase(body);
  }
}
