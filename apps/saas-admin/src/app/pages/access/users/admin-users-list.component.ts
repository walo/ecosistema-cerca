import { Component, OnInit, inject, signal, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { CercaTableComponent } from '../../../shared/components/organisms/cerca-table/cerca-table.component';
import { TableColumn } from '../../../shared/components/organisms/cerca-table/cerca-table.types';
import { AccessService } from '../../../core/services/access.service';
import { AdminUsersResource } from './admin-users.resource';
import { AdminUserRoleFormComponent } from './role-form/admin-user-role-form.component';
import { AdminUser } from '../../../core/models/access.model';

@Component({
    selector: 'app-admin-users-list',
    standalone: true,
    imports: [
        CommonModule,
        NzButtonModule,
        NzIconModule,
        NzModalModule,
        NzTooltipModule,
        CercaTableComponent
    ],
    templateUrl: './admin-users-list.component.html',
    styleUrls: ['./admin-users-list.component.scss']
})
export class AdminUsersListComponent implements OnInit {
    resource = new AdminUsersResource();
    loading = signal<boolean>(false);
    users = signal<AdminUser[]>([]);

    private accessService = inject(AccessService);
    private modalService = inject(NzModalService);
    private message = inject(NzMessageService);

    @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;
    @ViewChild('roleTemplate', { static: true }) roleTemplate!: TemplateRef<any>;

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

            if (col.col_ref === 'role') {
                tempCol.templateRef = this.roleTemplate;
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
        this.accessService.getAdminUsers().subscribe({
            next: (data) => {
                this.users.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                console.error(err);
                this.loading.set(false);
            }
        });
    }

    editRole(user: AdminUser): void {
        const modal = this.modalService.create({
            nzContent: AdminUserRoleFormComponent,
            nzData: {
                adminUser: user
            },
            nzFooter: null,
            nzWidth: 400
        });

        modal.afterClose.subscribe(result => {
            if (result) {
                this.loadData();
            }
        });
    }

    deleteUser(user: AdminUser): void {
        this.modalService.confirm({
            nzTitle: '¿Estás seguro de eliminar este administrador?',
            nzContent: `Usuario ID: ${user.user_id}`,
            nzOkText: 'Sí, eliminar',
            nzOkType: 'primary',
            nzOkDanger: true,
            nzOnOk: () => {
                this.accessService.removeAdminUser(user.user_id).subscribe({
                    next: (success) => {
                        if (success) {
                            this.message.success('Administrador eliminado');
                            this.loadData();
                        } else {
                            this.message.error('No se pudo eliminar el administrador');
                        }
                    },
                    error: () => this.message.error('Error al eliminar')
                });
            }
        });
    }
}
