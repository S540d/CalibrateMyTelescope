import { loadProfile, saveProfile, type HorizonProfile } from '../lib/obstacles';
import { type Location } from '../lib/astronomy';
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
  }

  private render(): void {
    this.root.innerHTML = this.buildShell();
    this.attachEvents();
    this.renderStep();
  }

  private buildShell(): string {
    const dots = Array.from({ length: TOTAL_STEPS }, (_, i) => {
      const cls =
        i + 1 < this.state.step ? 'done' : i + 1 === this.state.step ? 'active' : '';
      return `<div class="wiz-dot ${cls}"></div>`;
    }).join('');

    const canGoBack = this.state.step > 1;
    const canSkip = this.state.step < TOTAL_STEPS;

    return `
      <div class="wiz-header">
        <button class="wiz-back" id="btn-back" aria-label="Zurück" ${canGoBack ? '' : 'disabled'}>←</button>
        <span class="wiz-title">Schritt ${this.state.step} / ${TOTAL_STEPS}</span>
        ${canSkip ? `<button class="wiz-skip" id="btn-skip" aria-label="Schritt überspringen">Überspr.</button>` : '<span style="min-width:44px"></span>'}
      </div>
      <div class="wiz-dots">${dots}</div>
      <div class="wiz-body" id="step-body"></div>
      <div class="wiz-footer" id="step-footer"></div>
    `;
  }

  private attachEvents(): void {
    document.getElementById('btn-back')?.addEventListener('click', () => {
      if (this.state.step > 1) { this.state.step--; this.render(); }
    });
    document.getElementById('btn-skip')?.addEventListener('click', () => {
      if (this.state.step < TOTAL_STEPS) { this.state.step++; this.render(); }
    });
  }

  private next(): void {
    if (this.state.step < TOTAL_STEPS) { this.state.step++; this.render(); }
  }

  private renderStep(): void {
    const body = document.getElementById('step-body')!;
    const footer = document.getElementById('step-footer')!;

    switch (this.state.step) {
      case 1:
        new Step1Welcome(body, footer, () => this.next());
        break;
      case 2:
        new Step2Location(body, footer, (loc) => {
          this.state.location = loc;
          this.next();
        });
        break;
      case 3:
        new Step3PolarAlignment(body, footer, () => this.next());
        break;
      case 4:
        new Step4Obstacles(body, footer, this.state.profile, (profile) => {
          this.state.profile = profile;
          saveProfile(profile);
          this.next();
        });
        break;
      case 5:
        new Step5Stars(
          body,
          footer,
          this.state.profile,
          this.state.location,
          () => this.next()
        );
        break;
      case 6:
        new Step6Guide(body, footer);
        break;
    }
  }
}
