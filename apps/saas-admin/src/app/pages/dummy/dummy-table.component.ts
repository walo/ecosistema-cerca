import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NzButtonModule } from "ng-zorro-antd/button";
import { DummyEntity, DummyResource } from "./dummy.resource";
import { DummyService } from "./dummy.service";
import { BaseComponent } from "../../core/base/base.component";
import { BaseResource } from "../../core/base/base.resource";
import { CercaTableComponent } from "../../shared/components/organisms/cerca-table/cerca-table.component";

@Component({
  selector: "app-dummy-table",
  standalone: true,
  imports: [CommonModule, NzButtonModule, CercaTableComponent],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">{{ pantalla.scr_title }}</h1>
      
      <div class="mb-4 flex gap-2">
        <button nz-button nzType="primary" (click)="consultar({})">Recargar</button>
        <button nz-button nzType="default" (click)="onExport()">Exportar</button>
      </div>

      <app-cerca-table
        [data]="listado"
        [columns]="tableColumns"
        [loading]="loading"
        [pagination]="{ pageIndex: pageNumber, pageSize: pageSize, total: totalRegistros }"
        (pageChange)="pageNumber = $event; consultar(payload)"
        (pageSizeChange)="pageSize = $event; consultar(payload)"
        (filterChange)="onFilterChange($event)"
      ></app-cerca-table>
    </div>
  `,
  providers: [
    { provide: BaseResource, useClass: DummyResource }, // Provide concrete resource
    DummyService
  ]
})
export class DummyTableComponent extends BaseComponent<DummyEntity> implements OnInit {

  // Implement abstract service using inject
  protected _service = inject(DummyService);

  constructor() {
    super();
  }

  customAction(value: any, row: any, col: any): string {
    return `Action on ${value}`;
  }
}
