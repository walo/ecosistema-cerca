import { Component, OnInit } from "@angular/core";
import { AlertService } from "@core/services/general/alert/alert.service";
import { DataManagerService } from "@core/services/general/data-manager/data-manager.service";
import { StorageService } from "@core/services/storage.service";
import { ContainerActionConfig } from "@core/components/container-action/container-action.model";
import {
  BaseColumns,
  BaseExportQuery,
  BaseQuery,
  BaseResponse,
  BaseResultadoCargue,
  BaseUploadQuery,
} from "@core/models/parametrizacion/base/base.model";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import * as FileSaver from "file-saver";
import { BaseResource } from "./base.resource";
import { BaseService } from "./base.service";
import { UtilClass } from "@core/libs/shared/utils/utils";

@Component({
  selector: "app-base-component",
  template: ``,
})
export class BaseComponent<TEntity> implements OnInit {
  editButtons = document.querySelectorAll('[id^="editButton-"]');
  deleteButtons = document.querySelectorAll('[id^="deleteButton-"]');
  loading: boolean = true;
  totalRegistros: number = 0;
  totalPaginas: number = 1;
  pageSize: number = 4;
  pageNumber: number = 1;
  user: any;
  pantalla!: any;
  listado: TEntity[] | any[] = [];
  fieldFilter: string = "";
  excel_titles: string[] = [];
  columns: BaseColumns[] = [];
  columnsImport: BaseColumns[] = [];
  disableAdd: boolean = false;
  mandatory_messages = "";

  editCache: {
    [key: number]: { edit: boolean; data: TEntity };
  } = {};
  payload: { [key: string]: any } = {
    pageSize: this.pageSize,
    pageNumber: this.pageNumber,
  };

  public configContainer: ContainerActionConfig = {
    topControls: {
      clear: true,
      export: true,
      import: true,
      add: true,
      templates: true,
      update: false,
    },
    showBottom: false,
  };

  defaultValue = {
    id: 0,
    emp_codigo: 0,
    emp_zona_horaria: "",
    usu_login: "",
  };

  constructor(
    public storage: StorageService,
    public _service: BaseService<TEntity>,
    _resource: BaseResource,
    public _alertService: AlertService,
    public dataMngServ: DataManagerService
  ) {
    this.user = this.storage.getUser();
    this.pantalla = _resource.getPantalla(this.user.pai_codigo);
    this.excel_titles = _resource.getExcelTitles(this.user.pai_codigo);
    this.columns = _resource.getColumns(this.user.pai_codigo);
    this.columnsImport = _resource.getColumnsImport(this.user.pai_codigo);
    this.configContainer.topControls!.templatesUrl = [
      {
        url: "",
        name: this.pantalla.scr_messages![2].message,
      },
    ];
    this.defaultValue.emp_codigo = this.user.emp_codigo;
    this.defaultValue.emp_zona_horaria = this.user.zona_horaria;
    this.defaultValue.usu_login = this.user.usu_login.split("@", 1)[0];
    this.user.usu_name = this.user.usu_login.split("@", 1)[0];
  }

  ngOnInit(): void {
    this.payload["pageSize"] = this.pageSize;
    this.payload["pageNumber"] = this.pageNumber;
    this.payload["Entidad.emp_codigo"] = this.user.emp_codigo;
    this.payload["usu_login"] = this.user.usu_login.split("@", 1)[0];
    this.payload["emp_zona_horaria"] = this.user.emp_zona_horaria;

    this.dataMngServ.initialize(
      this.listado,
      this.excel_titles,
      this.pantalla.scr_fileName_template,
      undefined,
      this.excel_titles
    );
  }

  onDropdownVisibleChange(visible: boolean, column: any): void {
    if (visible) {
      setTimeout(() => {
        this.setFieldFilter(column.col_ref);
      }, 200);
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.payload["pageSize"] = pageSize;
    this.payload["pageNumber"] = pageIndex;
    this.consultar(this.payload);
  }

  disableButtons(excludeId: string = "", disable: boolean) {
    const editButtons = document.querySelectorAll('[id^="editButton-"]');
    const deleteButtons = document.querySelectorAll('[id^="deleteButton-"]');

    if (editButtons.length > 0) {
      for (let i = 0; i < editButtons.length; i++) {
        const htmlButton = editButtons[i] as HTMLButtonElement;
        if (htmlButton.id === "") {
          htmlButton.disabled = disable;
          continue;
        }
        if (htmlButton.id !== excludeId) {
          htmlButton.disabled = disable;
        }
      }
    }

    if (deleteButtons.length > 0) {
      for (let i = 0; i < deleteButtons.length; i++) {
        const htmlButton = deleteButtons[i] as HTMLButtonElement;
        if (htmlButton.id === "") {
          htmlButton.disabled = disable;
          continue;
        }
        if (htmlButton.id !== excludeId) {
          htmlButton.disabled = disable;
        }
      }
    }
  }

  getDecimalPattern(max: number, required: boolean = true): string {
    if (required) {
      return `^(0|[1-9][0-9]*)(\.[0-9]{1,${max}})?$`;
    } else {
      return `^[0-9]+(\.[0-9]{1,${max}})?$`;
    }
  }

  public consultar(query: BaseQuery<TEntity> | any): void {
    this.loading = true;
    this._service.Consultar(query).subscribe({
      next: (response) => {
        var res = response.resultadoConsulta as BaseResponse<TEntity>[];
        this.listado = res[0].reportes;
        this.loading = false;
        this.totalRegistros = response.totalRegistros;
        this.totalPaginas = response.totalPaginas;
        this.updateEditCache();
      },
      error: (er) => {
        this._alertService.error(
          this.pantalla.scr_messages_generic_base!.msg_service_error
        );
        this.loading = false;
      },
    });
  }

  getTotal() {
    return `Total: ${this.totalRegistros}`;
  }

  validOnAdd(): any {
    for (const key in this.editCache) {
      if (this.editCache.hasOwnProperty(key) && this.editCache[key].edit) {
        return true;
      }
    }
    return false;
  }

  public validateForm(form: any): Promise<boolean> {
    this.mandatory_messages = "";
    return new Promise((resolve) => {
      var mandatoryColumns = this.columns.filter((x: any) => x.is_mandatory);
      if (mandatoryColumns.length > 0) {
        mandatoryColumns.forEach((x: any) => {
          if (
            form[x.col_ref] === null ||
            form[x.col_ref] === undefined ||
            form[x.col_ref] === ""
          ) {
            this.mandatory_messages += x.is_mandatory_message + ". ";
          }
        });
        if (this.mandatory_messages.length > 0) {
          this._alertService.info(this.mandatory_messages);
          resolve(false);
          return;
        }
      }
      resolve(true);
    });
  }

  public onTemplate(): void {
    this.dataMngServ.downloadTemplate();
  }

  public onExport(exportType: string): void {
    this.loading = true;
    this._alertService.info(
      this.pantalla.scr_messages_generic_base!.msg_export_info
    );
    const entidadKeys = Object.keys(this.payload).filter((key) =>
      key.startsWith("Entidad.")
    );
    const entidadBody: { [key: string]: any } = {};
    entidadKeys.forEach((key) => {
      const newKey = key.replace("Entidad.", "");
      entidadBody[newKey] = this.payload[key];
    });
    let body: BaseExportQuery<any> = {
      exportType: exportType,
      total: this.totalRegistros,
      columns: this.columns,
      entidad: entidadBody,
      usu_name: this.user.usu_name,
      zona_horaria: this.user.emp_zona_horaria,
      emp_cantidad_decimales: this.user.emp_cantidad_decimales,
    };
    this._service.Exportar(body).subscribe((data) => {
      if (data instanceof Blob) {
        const fileName = `${
          this.pantalla.scr_fileName_export
        } - ${this.getCurrentDate()}.${exportType}`;
        UtilClass.exportarArchivo(exportType, data, fileName);
        this._alertService.success(
          this.pantalla.scr_messages_generic_base!.msg_export_message_succes
        );
      } else {
        this._alertService.error(
          this.pantalla.scr_messages_generic_base!.msg_export_message_error
        );
      }
    });
    this.loading = false;
  }

  onReset() {
    this.disableAdd = false;
    this.disableButtons("", false);
    this.payload = {};
    this.payload["pageSize"] = this.pageSize;
    this.payload["pageNumber"] = this.pageNumber;
    this.payload["Entidad.emp_codigo"] = this.user.emp_codigo;
    this.consultar(this.payload);
  }

  onAdd() {
    this.disableAdd = true;
    const obj = this.initializeObject(this.defaultValue);
    this.listado = [obj, ...this.listado];
    this.updateEditCache();
    this.startEdit(0);
    this.totalRegistros++;
  }

  startEdit(id: number): void {
    this.disableAdd = true;
    this.editCache[id].edit = true;
    this.disableButtons(`editButton-${id}`, true);
    this.disableButtons(`deleteButton-${id}`, true);
  }

  getAffirmativeCheckLabel(item: string): string {
    if (!item.includes("Entidad.")) {
      item = "Entidad." + item;
    }
    const column = this.pantalla.scr_table_columns.find(
      (x: any) => x.col_ref === item
    );
    return column.boolean_label_affirmative;
  }

  getNegativeCheckLabel(item: string): string {
    if (!item.includes("Entidad.")) {
      item = "Entidad." + item;
    }
    const column = this.pantalla.scr_table_columns.find(
      (x: any) => x.col_ref === item
    );
    return column.boolean_label_negative;
  }

  cancelEdit(id: number): void {
    const index = this.listado.findIndex((item: any) => item.id === id);
    this.editCache[id] = {
      data: {
        ...this.listado[index],
        emp_zona_horaria: this.user.emp_zona_horaria,
        usu_login: this.user.usu_name,
      },
      edit: false,
    };
    if (id === 0 && index !== -1) {
      this.listado.splice(index, 1);
      this.totalRegistros--;
    }
    this.disableAdd = false;
    this.disableButtons("", false);
    this.disableButtons("", false);
  }

  onDelete(id: number): void {
    this.loading = true;
    if (id === 0) {
      this.listado = this.listado.filter((item: any) => item.id === id);
      this.totalRegistros--;
      this.loading = false;
      return;
    }
    this._service.Eliminar(this.editCache[id].data).subscribe({
      next: (response) => {
        if (response.resultadoConsulta == null) {
          this._alertService.error(response.responseMessage);
          this.cancelEdit(id);
          this.loading = false;
          return;
        }
        this._alertService.success(
          this.pantalla.scr_messages_generic_base!.msg_delete_succes
        );
        this.consultar(this.payload);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  saveEdit(id: number): void {
    this.validateForm(this.editCache[id].data).then((resp) => {
      if (!resp) return;
      if (id !== 0) {
        this._service.Actualizar(this.editCache[id].data).subscribe({
          next: (response) => {
            if (response.resultadoConsulta == null) {
              this._alertService.error(response.responseMessage);
              this.cancelEdit(id);
              return;
            }
            const index = this.listado.findIndex((item: any) => item.id === id);
            Object.assign(this.listado[index], this.editCache[id].data);
            this.editCache[id].edit = false;
            this.disableAdd = false;
            this._alertService.success(
              this.pantalla.scr_messages_generic_base!.msg_update_succes
            );
            this.consultar(this.payload);
          },
          error: () => (this.loading = false),
        });
      } else {
        this._service.Insertar(this.editCache[id].data).subscribe({
          next: (response) => {
            if (response.resultadoConsulta == null) {
              this._alertService.error(response.responseMessage);
              this.cancelEdit(id);
              this.disableAdd = false;
              return;
            }
            const index = this.listado.findIndex((item) => item.id === id);
            Object.assign(this.listado[index], this.editCache[id].data);
            this.editCache[id].edit = false;
            this.disableAdd = false;
            this._alertService.success(
              this.pantalla.scr_messages_generic_base!.msg_create_succes
            );
            this.consultar(this.payload); //SE AGREGO PARA QUE AL MOMENTO DE AGREGAR UN SEGUNDO REGISTRO NO DUPLIQUE.
          },
          error: () => (this.loading = false),
        });
      }
    });
  }

  updateEditCache(): void {
    this.listado.forEach((item) => {
      this.editCache[item.id!] = {
        edit: false,
        data: {
          ...item,
          emp_zona_horaria: this.user.emp_zona_horaria,
          usu_login: this.user.usu_name,
        },
      };
    });
  }

  public resetFilter(): void {
    this.payload[`${this.fieldFilter}`] = null;
    this.consultarFiltros();
  }

  public consultarFiltros() {
    const columnToUpdate = this.pantalla.scr_table_columns.find(
      (column: any) => column.col_ref === this.fieldFilter
    );
    if (columnToUpdate) {
      columnToUpdate.is_visible = false;
    }
    this.payload["pageNumber"] = 1;
    this.consultar(this.payload);
  }

  public setFieldFilter(field: string): void {
    this.fieldFilter = field;
  }

  onImport() {
    const input = document.createElement("input");
    input.type = "file";
    input.addEventListener("change", (event) => {
      this.onFileSelectedonFileSelected(event);
    });
    input.click();
  }

  public onFileSelectedonFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      this.loading = true;
      const entidadKeys = Object.keys(this.payload).filter((key) =>
        key.startsWith("Entidad.")
      );
      const entidadBody: { [key: string]: any } = {};
      entidadKeys.forEach((key) => {
        const newKey = key.replace("Entidad.", "");
        entidadBody[newKey] = this.payload[key];
      });
      let body: BaseUploadQuery = {
        emp_codigo: this.user.emp_codigo,
        usu_name: this.user.usu_name,
        len_cultura: this.user.len_cultura,
        columns: this.columnsImport,
        usuario: this.user.usu_name,
        zona_horaria: this.user.emp_zona_horaria,
      };
      formData.append(file.name, file);
      formData.append("body", JSON.stringify(body));
      this._service.Importar(formData).subscribe({
        next: (response) => {
          if (response.resultadoConsulta == null) {
            this._alertService.error(response.responseMessage);
          }
          var res = response.resultadoConsulta as BaseResponse<TEntity>[];
          if (
            res[0].resultadoCargue?.some((y) => y.resultadoValidacion !== "Ok")
          ) {
            this._alertService.error(
              this.pantalla.scr_messages_generic_base!.msg_import_error
            );

            const columnasDeseadas: Array<keyof BaseResultadoCargue<TEntity>> =
              this.pantalla.scr_table_columns
                .map((x: any) => x.col_ref)
                .concat("resultadoValidacion");

            const listaFiltrada = res[0].resultadoCargue.map((item: any) => {
              const flattenedObject = columnasDeseadas.reduce((obj, key) => {
                if (key.startsWith("Entidad.")) {
                  const entityKey = key.replace("Entidad.", "");
                  obj[key] = item.entidad[entityKey];
                } else if (item[key] == undefined) {
                  obj[key] = item.entidad[key];
                } else {
                  obj[key] = item[key];
                }
                return obj;
              }, {} as { [key: string]: any });

              return flattenedObject;
            });
            this.exportExcel(listaFiltrada);
          } else {
            this._alertService.success(
              this.pantalla.scr_messages_generic_base!.msg_import_succes
            );
          }
          this.consultar(this.payload);
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
    }
  }

  public exportExcel(list: any[]): void {
    const titles = this.pantalla.scr_table_columns.map((x: any) => x.col_name);
    titles.push(this.pantalla.scr_label_column_error);
    import("xlsx").then((xlsx) => {
      const ws = xlsx.utils.book_new();
      xlsx.utils.sheet_add_aoa(ws, [titles]);
      const worksheet = xlsx.utils.sheet_add_json(ws, list, {
        origin: "A2",
        skipHeader: true,
      });
      const workbook = {
        Sheets: { export_: worksheet },
        SheetNames: ["export_"],
      };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      this.saveAsExcelFile(excelBuffer, ".xlsx");
    });
  }

  public saveAsExcelFile(buffer: any, extension: string): void {
    let EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8;";
    const data: Blob = new Blob(
      [extension == ".csv" ? "\uFEFF" + buffer : buffer],
      {
        type: EXCEL_TYPE,
      }
    );
    FileSaver.saveAs(
      data,
      `${
        this.pantalla.scr_fileName_errors
      } - ${this.getCurrentDate()}.${extension}`
    );
  }

  getCurrentDate() {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      hourCycle: "h24",
    };

    const currentDate = new Date();
    return new Intl.DateTimeFormat(this.user.len_culture, options).format(
      currentDate
    );
  }

  getAffirmativeLabel(value: string): string {
    if (value.includes("Entidad.")) {
      value = value.replace("Entidad.", "");
    }
    const column = this.columns.find((x: any) => x.col_ref === value);
    return column?.boolean_label_affirmative ?? "";
  }

  getNegativeLabel(value: string): string {
    if (value.includes("Entidad.")) {
      value = value.replace("Entidad.", "");
    }
    const column = this.columns.find((x: any) => x.col_ref === value);
    return column?.boolean_label_negative ?? "";
  }

  initializeObject<TEntity extends Record<string, any>>(
    defaultValue: TEntity
  ): TEntity {
    const obj: Partial<TEntity> = { ...defaultValue };
    const keys = Object.keys(defaultValue) as Array<keyof TEntity>;

    for (const prop of keys) {
      if (prop === "emp_codigo") {
        obj[prop] = this.user.emp_codigo;
        continue;
      }
      if (prop === "emp_zona_horaria") {
        obj[prop] = this.user.emp_zona_horaria;
        continue;
      }
      if (prop === "usu_login") {
        obj[prop] = this.user.usu_name;
        continue;
      }

      const valueType = typeof defaultValue[prop];

      switch (valueType) {
        case "string":
          obj[prop] = "" as TEntity[keyof TEntity];
          break;
        case "number":
          obj[prop] = 0 as TEntity[keyof TEntity];
          break;
        case "boolean":
          obj[prop] = false as TEntity[keyof TEntity];
          break;
        case "object":
          if (defaultValue[prop] && defaultValue[prop].constructor === Date) {
            obj[prop] = new Date() as TEntity[keyof TEntity];
          } else {
            obj[prop] = null as TEntity[keyof TEntity];
          }
          break;
        default:
          obj[prop] = null as TEntity[keyof TEntity];
      }
    }

    return obj as TEntity;
  }

  get visibleColumns() {
    return this.pantalla?.scr_table_columns?.filter((c: any) => c.is_visible_column !== false) || [];
  }

  getCellValue(row: any, column: any): any {
    if (!column || !column.col_ref) return "";

    const getNested = (obj: any, path: string) => {
      if (!obj || !path) return undefined;
      const parts = path.split(".");
      let cur = obj;
      for (const p of parts) {
        if (cur == null) return undefined;
        cur = cur[p];
      }
      return cur;
    };

    let rawValue = getNested(row, column.col_ref);

    if (rawValue === undefined && row && column.col_ref in row) {
      rawValue = row[column.col_ref];
    }

    if (rawValue === undefined) {
      const parts = column.col_ref.split(".");
      const last = parts[parts.length - 1];
      rawValue = row ? row[last] : undefined;
    }

    const value = rawValue ?? "";

    if (typeof value === "boolean") {
      if (value && column.boolean_label_affirmative) return column.boolean_label_affirmative;
      if (!value && column.boolean_label_negative) return column.boolean_label_negative;
      return value ? "Sí" : "No";
    }

    let formatted: any = value;

    // func_to_execute (string nombre o función)
    const func = column?.func_to_execute;
    if (func) {
      if (typeof func === "string") {
        const fn = (this as any)[func];
        if (typeof fn === "function") {
          const num = Number(formatted);
          formatted = fn.call(this, formatted, row, column);
        }
      } else if (typeof func === "function") {
        const num = Number(formatted);
        formatted = func.call(this, formatted, row, column);
      }
    }

    // pipe_to_apply (ej: "number:'1.2-2'" o "date:'yyyy-MM-dd'") - implementación básica
    const pipeConfig: string | null = column?.pipe_to_apply ?? null;
    if (pipeConfig && typeof pipeConfig === "string") {
      const match = pipeConfig.match(/^(\w+)(?::'(.*)')?$/);
      if (match) {
        const pipeName = match[1];
        const pipeArg = match[2] ?? "";

        try {
          if (pipeName === "number") {
            const digits = pipeArg; // ej "1.2-2"
            let minFrac: number | undefined;
            let maxFrac: number | undefined;
            if (digits) {
              const parts = digits.split(".");
              if (parts.length > 1) {
                const fracPart = parts[1];
                const [minS, maxS] = fracPart.split("-");
                minFrac = parseInt(minS, 10);
                maxFrac = parseInt(maxS ?? minS, 10);
              }
            }
            const num = Number(formatted);
            if (!isNaN(num)) {
              formatted = num.toLocaleString(undefined, {
                minimumFractionDigits: minFrac ?? 0,
                maximumFractionDigits: maxFrac ?? 0,
              });
            }
          } else if (pipeName === "date") {
            const pattern = pipeArg || "yyyy-MM-dd";
            const date = new Date(formatted);
            if (!isNaN(date.getTime())) {
              const pad = (n: number) => n.toString().padStart(2, "0");
              formatted = pattern
                .replace("yyyy", String(date.getFullYear()))
                .replace("MM", pad(date.getMonth() + 1))
                .replace("dd", pad(date.getDate()))
                .replace("HH", pad(date.getHours()))
                .replace("mm", pad(date.getMinutes()))
                .replace("ss", pad(date.getSeconds()));
            }
          }
        } catch {
          // en error devolvemos formatted sin cambios
        }
      }
    }

    return formatted;
  }
}
