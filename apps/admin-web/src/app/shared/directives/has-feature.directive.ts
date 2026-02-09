import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { SubscriptionService } from '../../core/services/subscription.service';

@Directive({
    selector: '[hasFeature]',
    standalone: true
})
export class HasFeatureDirective {
    private subService = inject(SubscriptionService);
    private templateRef = inject(TemplateRef<any>);
    private vcr = inject(ViewContainerRef);

    private featureKey: string = '';
    private elseTemplate?: TemplateRef<any>;

    @Input('hasFeature') set key(val: string) {
        this.featureKey = val;
        this.updateView();
    }

    @Input('hasFeatureElse') set else(val: TemplateRef<any>) {
        this.elseTemplate = val;
        this.updateView();
    }

    constructor() {
        // Reacciona a cambios en el estado de la suscripción automáticamente
        effect(() => {
            const currentSub = this.subService.subscriptionStatus();
            this.updateView();
        });
    }

    private updateView() {
        this.vcr.clear();

        if (this.subService.hasFeature(this.featureKey)) {
            this.vcr.createEmbeddedView(this.templateRef);
        } else if (this.elseTemplate) {
            this.vcr.createEmbeddedView(this.elseTemplate);
        }
    }
}
