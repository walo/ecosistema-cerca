import { Injectable } from "@angular/core";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

@Injectable({
    providedIn: "root",
})
export class DataManagerService {
    private listado: any[] = [];
    private excelTitles: string[] = [];
    private templateName: string = "template";

    initialize(
        listado: any[],
        excelTitles: string[],
        templateName: string,
        _: any, // Placeholder for potential future args
        __: any // Placeholder
    ) {
        this.listado = listado;
        this.excelTitles = excelTitles;
        this.templateName = templateName;
    }

    downloadTemplate(): void {
        // Lógica básica para descargar un template de excel vacío con los headers
        const worksheet = XLSX.utils.aoa_to_sheet([this.excelTitles]);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        this.saveAsExcelFile(excelBuffer, this.templateName);
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const EXCEL_EXTENSION = ".xlsx";
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE,
        });
        FileSaver.saveAs(data, fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION);
    }
}
