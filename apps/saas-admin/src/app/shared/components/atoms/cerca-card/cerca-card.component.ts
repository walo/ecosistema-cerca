import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cerca-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cerca-card" [ngClass]="{'hover-effect': hoverEffect, 'glass': glassEffect, 'no-padding': noPadding}">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .cerca-card {
      background: white;
      border-radius: var(--radius-cerca-sm);
      box-shadow: var(--shadow-premium); 
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      height: 100%;
      overflow: hidden;
      position: relative;
      padding: 1.5rem; /* Default padding */
    }

    .cerca-card.no-padding {
        padding: 0;
    }

    .cerca-card.hover-effect:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-premium-hover);
    }
    
    .cerca-card.glass {
      backdrop-filter: blur(12px);
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  `]
})
export class CercaCardComponent {
  @Input() hoverEffect: boolean = true;
  @Input() glassEffect: boolean = false;
  @Input() noPadding: boolean = false;
}
