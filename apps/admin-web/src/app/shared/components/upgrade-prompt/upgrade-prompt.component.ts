import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-upgrade-prompt',
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule],
    template: `
        <div class="upgrade-container">
            <mat-card class="upgrade-card">
                <mat-icon class="lock-icon">lock</mat-icon>
                <h2>Función Premium</h2>
                <p *ngIf="featureName">
                    El módulo de <strong>{{ featureName }}</strong> no está incluido en tu plan actual.
                </p>
                <p *ngIf="!featureName">
                    Tu suscripción actual no permite el acceso a esta sección.
                </p>
                
                <div class="actions">
                    <button mat-raised-button color="primary" routerLink="/settings/billing">
                        Ver Planes de Mejora
                    </button>
                    <button mat-button routerLink="/dashboard">
                        Volver al Inicio
                    </button>
                </div>
            </mat-card>
        </div>
    `,
    styles: [`
        .upgrade-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 80vh;
            padding: 20px;
        }
        .upgrade-card {
            max-width: 500px;
            text-align: center;
            padding: 40px;
        }
        .lock-icon {
            font-size: 64px;
            height: 64px;
            width: 64px;
            color: #f44336;
            margin-bottom: 20px;
        }
        .actions {
            margin-top: 30px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `]
})
export class UpgradePromptComponent implements OnInit {
    private route = inject(ActivatedRoute);
    featureName: string | null = null;

    ngOnInit() {
        this.featureName = this.route.snapshot.queryParamMap.get('feature');
    }
}
