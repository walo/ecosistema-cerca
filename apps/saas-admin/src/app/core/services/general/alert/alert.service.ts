import { Injectable, inject } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";

@Injectable({
    providedIn: "root",
})
export class AlertService {
    private message = inject(NzMessageService);

    success(msg: string): void {
        this.message.success(msg);
    }

    error(msg: string): void {
        this.message.error(msg);
    }

    info(msg: string): void {
        this.message.info(msg);
    }

    warning(msg: string): void {
        this.message.warning(msg);
    }
}
