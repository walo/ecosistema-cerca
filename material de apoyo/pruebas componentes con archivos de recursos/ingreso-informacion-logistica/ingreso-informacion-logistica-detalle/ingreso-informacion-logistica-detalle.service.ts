import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { InformacionLogisticaModel } from "@core/models/parametrizacion/ingreso-informacion-logistica/ingreso-informacion-logistica";
import { ConfigService } from "@core/services/config.service";
import { catchError, Observable, throwError } from "rxjs";
import { GlobalService } from "src/app/core/services/globalService";
import { BaseService } from "../../base/base.service";
import { BaseHttpResponse } from "@core/models/parametrizacion/base/base.model";

@Injectable({
  providedIn: "root",
})
export class InformacionLogisticaDetalleService extends BaseService<InformacionLogisticaModel> {
  private options: any;
  constructor(
    http: HttpClient,
    configService: ConfigService,
    service: GlobalService
  ) {
    super(http, service);
    //this.endpoint = `${configService.createRouteApi(configService.variables.API_PARAMETROS)}/api/InformacionLogistica`;
    this.endpoint = configService.variables.API_PARAMETROS_URL + `/api/InformacionLogistica/`;

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

  public consultarCliente(cliente: any): Observable<any> {
    const url = `${this.endpoint}ConsultarCliente?intEmpresa=${cliente.emp_codigo}&cliCodigo=${cliente.cli_codigo}`;
    return this.http.get<any>(url).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(err.message);
      })
    );
  }

}
