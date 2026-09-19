import { loadProfile, saveProfile, type HorizonProfile } from '../lib/obstacles';
import { type Location } from '../lib/astronomy';
import { requireElement } from '../lib/dom';
import { AboutModal } from './AboutModal';
import { Step1Welcome } from './Step1Welcome';
import { Step2Location } from './Step2Location';
import { Step3PolarAlignment } from './Step3PolarAlignment';
import { Step4Obstacles } from './Step4Obstacles';
import { Step5Stars } from './Step5Stars';
import { Step6Guide } from './Step6Guide';

export interface WizardState {
  step: number;
  location: Location | null;
  profile: HorizonProfile;
}

const TOTAL_STEPS = 6;

export class Wizard {
  private root: HTMLElement;
  private state: WizardState;

  constructor(root: HTMLElement) {
    this.root = root;
    this.state = {
      step: 1,
      location: null,
      profile: loadProfile(),
    };
    this.render();

    // Bound once for the lifetime of the app (not per render), so the
    // dropdown closes on any outside click regardless of which step is shown.
    document.addEventListener('click', () => {
      document.getElementById('menu-dropdown')?.classList.add('hidden');
    });
  }

  private render(): void {
    this.root.innerHTML = this.buildShell();
    this.attachEvents();
    this.renderStep();
  }

  private buildShell(): string {
    const dots = Array.from({ length: TOTAL_STEPS }, (_, i) => {
      const cls = i + 1 < this.state.step ? 'done' : i + 1 === this.state.step ? 'active' : '';
      return `<div class="wiz-dot ${cls}"></div>`;
    }).join('');

    const canGoBack = this.state.step > 1;
    const canSkip = this.state.step < TOTAL_STEPS;

    return `
      <div class="wiz-header">
        <button class="wiz-back" id="btn-back" aria-label="Zurück" ${canGoBack ? '' : 'disabled'}>←</button>
        <span class="wiz-title">Schritt ${this.state.step} / ${TOTAL_STEPS}</span>
        <div class="wiz-header-right">
          ${canSkip ? `<button class="wiz-skip" id="btn-skip" aria-label="Schritt überspringen">Überspr.</button>` : ''}
          <div class="wiz-menu-wrap">
            <button class="wiz-menu-btn" id="btn-menu" aria-label="Menü" aria-haspopup="true" aria-expanded="false">⋮</button>
            <div class="wiz-menu-dropdown hidden" id="menu-dropdown" role="menu">
              <button class="wiz-menu-item" id="menu-about" role="menuitem">Über</button>
            </div>
          </div>
        </div>
      </div>
      <div class="wiz-dots">${dots}</div>
      <div class="wiz-body" id="step-body"></div>
      <div class="wiz-footer" id="step-footer"></div>
    `;
  }

  private attachEvents(): void {
    document.getElementById('btn-back')?.addEventListener('click', () => {
      if (this.state.step > 1) {
        this.state.step--;
        this.render();
      }
    });
    document.getElementById('btn-skip')?.addEventListener('click', () => {
      if (this.state.step < TOTAL_STEPS) {
        this.state.step++;
        this.render();
      }
    });

    const menuBtn = document.getElementById('btn-menu');
    const dropdown = document.getElementById('menu-dropdown');
    menuBtn?.addEventListener('click', e => {
      e.stopPropagation();
      const isHidden = dropdown?.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', isHidden ? 'false' : 'true');
    });
    document.getElementById('menu-about')?.addEventListener('click', () => {
      dropdown?.classList.add('hidden');
      new AboutModal();
    });
  }

  private next(): void {
    if (this.state.step < TOTAL_STEPS) {
      this.state.step++;
      this.render();
    }
  }

  private renderStep(): void {
    const body = requireElement('step-body');
    const footer = requireElement('step-footer');

    switch (this.state.step) {
      case 1:
        new Step1Welcome(body, footer, () => this.next());
        break;
      case 2:
        new Step2Location(body, footer, loc => {
          this.state.location = loc;
          this.next();
        });
        break;
      case 3:
        new Step3PolarAlignment(body, footer, () => this.next());
        break;
      case 4:
        new Step4Obstacles(body, footer, this.state.profile, profile => {
          this.state.profile = profile;
          saveProfile(profile);
          this.next();
        });
        break;
      case 5:
        new Step5Stars(body, footer, this.state.profile, this.state.location, () => this.next());
        break;
      case 6:
        new Step6Guide(body, footer);
        break;
    }
  }
}
