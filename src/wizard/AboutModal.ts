import { version } from '../../package.json';

const REPO_URL = 'https://github.com/S540d/CalibrateMyTelescope';
const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=om.sven4321.calibratemytelescope';
const IMPRESSUM_URL = 'https://s540d.github.io/impressum.html';
const PRIVACY_URL = '/CalibrateMyTelescope/privacy-policy.html';
const ISSUES_URL = `${REPO_URL}/issues`;

/**
 * "Über" overlay, following the shared cross-project standard
 * (project-templates/dev-standards/about-section.md): App name, version,
 * Impressum, Datenschutz, Quellcode, Play Store, Feedback/Kontakt.
 */
export class AboutModal {
  private overlay: HTMLDivElement;
  private onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') this.close();
  };

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.innerHTML = `
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="about-title">
        <div class="modal-header">
          <h2 id="about-title">Über</h2>
          <button class="modal-close" id="about-close" aria-label="Schließen">✕</button>
        </div>
        <div class="modal-body">
          <p class="about-app-name">Telescope Align</p>
          <p class="about-version">Version v${version}</p>
          <div class="about-links">
            <a href="${IMPRESSUM_URL}" target="_blank" rel="noopener noreferrer">Impressum</a>
            <a href="${PRIVACY_URL}" target="_blank" rel="noopener noreferrer">Datenschutz</a>
            <a href="${REPO_URL}" target="_blank" rel="noopener noreferrer">Quellcode (GitHub)</a>
            <a href="${PLAY_STORE_URL}" target="_blank" rel="noopener noreferrer">Play Store</a>
            <a href="${ISSUES_URL}" target="_blank" rel="noopener noreferrer">Feedback / Kontakt</a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    this.overlay.addEventListener('click', e => {
      if (e.target === this.overlay) this.close();
    });
    document.getElementById('about-close')?.addEventListener('click', () => this.close());
    document.addEventListener('keydown', this.onKeydown);
  }

  private close(): void {
    document.removeEventListener('keydown', this.onKeydown);
    this.overlay.remove();
  }
}
