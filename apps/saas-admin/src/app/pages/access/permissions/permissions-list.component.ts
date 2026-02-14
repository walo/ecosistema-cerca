import { Component, OnInit, inject, signal, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal'; // Keep NzModalService for creating modals
import { NzMessageService } from 'ng-zorro-antd/message';
import { CercaTableComponent } from '../../../shared/components/organisms/cerca-table/cerca-table.component';
import { TableColumn } from '../../../shared/components/organisms/cerca-table/cerca-table.types';
import { AccessService } from '../../../core/services/access.service';
import { PermissionsResource } from './permissions.resource'; // Keep original resource
import { PermissionFormComponent } from './permission-form/permission-form.component'; // Keep original form component
import { Permission } from '../../../core/models/access.model'; // Keep original model

@Component({
    selector: 'app-permissions-list',
    standalone: true,
    imports: [
        CommonModule,
        NzButtonModule,
        NzIconModule,
        NzModalModule,
        CercaTableComponent
    ],
    templateUrl: './permissions-list.component.html',
    styleUrls: ['./permissions-list.component.scss']
})
export class PermissionsListComponent implements OnInit {
    resource = new PermissionsResource();
    loading = signal<boolean>(false);
    permissions = signal<Permission[]>([]);

    private accessService = inject(AccessService);
    private modalService = inject(NzModalService);
    private message = inject(NzMessageService);

    @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;
    @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;

    tableColumns: TableColumn[] = [];

    ngOnInit(): void {
        this.initializeColumns();
        this.loadData();
    }

    initializeColumns(): void {
        const resourceColumns = this.resource.getColumns('CO');
        this.tableColumns = resourceColumns.map(col => {
            const tempCol: TableColumn = {
                key: col.col_ref,
                label: col.col_name,
                type: 'text',
                width: col.col_width
            };

            if (col.col_ref === 'status_id') {
                tempCol.templateRef = this.statusTemplate;
            }

            return tempCol;
        });

        this.tableColumns.push({
            key: 'actions',
            label: 'Acciones',
            type: 'template',
            templateRef: this.actionsTemplate,
            align: 'right',
            width: '100px'
        });
    }

    loadData(): void {
        this.loading.set(true);
        this.accessService.getPermissions().subscribe({
            next: (data) => {
                this.permissions.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error(err);
                this.loading.set(false);
            }
        });
    }

    openForm(permission?: Permission): void {
        const modal = this.modalService.create({
            nzContent: PermissionFormComponent,
            nzData: {
                permission: permission
            },
            nzFooter: null,
            nzWidth: 600
        });

        modal.afterClose.subscribe(result => {
            if (result) {
                this.loadData();
            }
        });
    }

    deletePermission(permission: Permission): void {
        this.modalService.confirm({
            nzTitle: '¿Estás seguro de eliminar este permiso?',
            nzContent: `${permission.module} - ${permission.option}`,
            nzOkText: 'Sí, eliminar',
            nzOkType: 'primary',
            nzOkDanger: true,
            nzOnOk: () => {
                this.accessService.deletePermission(permission.id).subscribe({
                    next: (success) => {
                        if (success) {
                            this.message.success('Permiso eliminado');
                            this.loadData();
                        } else {
                            this.message.error('No se pudo eliminar el permiso');
                        }
                    },
                    error: () => this.message.error('Error al eliminar')
                });
            }
        });
    }
}
