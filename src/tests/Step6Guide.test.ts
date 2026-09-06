import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Step6Guide } from '../wizard/Step6Guide';

describe('Step6Guide', () => {
  let body: HTMLElement;
  let footer: HTMLElement;

  beforeEach(() => {
    body = document.createElement('div');
    footer = document.createElement('div');
  });

  it('renders all guide steps and a restart button', () => {
    new Step6Guide(body, footer);
    expect(body.querySelectorAll('.guide-step')).toHaveLength(8);
    expect(footer.querySelector('#btn-restart')).toBeTruthy();
  });

  it('reloads the page when the restart button is clicked', () => {
    new Step6Guide(body, footer);
    const reload = vi.fn();
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, reload },
    });

    footer.querySelector<HTMLButtonElement>('#btn-restart')?.click();
    expect(reload).toHaveBeenCalledOnce();

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
});
