import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Configuración</h1>
      <p class="text-gray-600">Módulo de configuración en construcción.</p>
    </div>
  `
})
export class SettingsComponent { }
