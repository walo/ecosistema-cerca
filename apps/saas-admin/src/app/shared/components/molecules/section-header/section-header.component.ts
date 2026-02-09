import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
    selector: 'app-section-header',
    standalone: true,
    imports: [CommonModule, RouterModule, NzButtonModule, NzIconModule],
    template: `
    <div class="premium-header-card">
      <div class="header-main">
        <div class="title-group">
          <h1 class="premium-title">
            <!-- Title with optional highlighted accent part -->
            {{ titlePrefix }} <span class="accent-text" *ngIf="titleAccent">{{ titleAccent }}</span>
            <span *ngIf="!titleAccent">{{ title }}</span>
          </h1>
          <p class="premium-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
        </div>
        
        <div class="header-actions">
          <ng-content select="[extraActions]"></ng-content>
          
          <button *ngIf="actionLabel" nz-button nzType="primary" class="premium-button" (click)="onAction()">
            <span nz-icon [nzType]="actionIcon"></span>
            {{ actionLabel }}
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .premium-header-card {
      background: white;
      padding: 1.5rem 2rem;
      border-radius: 16px;
      box-shadow: var(--shadow-premium);
      margin-bottom: 2rem;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.03);

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(to right, var(--color-primary), var(--color-primary-accent));
      }
    }

    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .title-group .premium-title {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.04em;
      margin: 0;
      color: var(--color-slate-900);
      line-height: 1.2;
    }

    .title-group .premium-title .accent-text {
      background: var(--gradient-premium); /* Or accent gradient */
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-accent) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .title-group .premium-subtitle {
      margin-top: 0.25rem;
      color: var(--color-slate-500);
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: -0.01em;
    }

    .premium-button {
      height: 42px;
      padding: 0 1.5rem;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 12px -2px rgba(0, 40, 85, 0.2);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      background-color: var(--color-primary);
      border-color: var(--color-primary);
    }

    .premium-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px -4px rgba(91, 194, 231, 0.3);
      filter: brightness(1.1);
    }
  `]
})
export class SectionHeaderComponent {
    @Input() title: string = '';
    /** If provided, title will be split: prefix + accentSpan */
    @Input() titlePrefix: string = '';
    @Input() titleAccent: string = '';

    @Input() subtitle: string = '';
    @Input() actionLabel: string = '';
    @Input() actionIcon: string = 'plus';

    @Output() actionClicked = new EventEmitter<void>();

    onAction() {
        this.actionClicked.emit();
    }
}
