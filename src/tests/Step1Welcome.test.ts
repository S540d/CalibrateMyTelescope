import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Step1Welcome } from '../wizard/Step1Welcome';

describe('Step1Welcome', () => {
  let body: HTMLElement;
  let footer: HTMLElement;

  beforeEach(() => {
    body = document.createElement('div');
    footer = document.createElement('div');
  });

  it('renders a welcome heading and a start button', () => {
    new Step1Welcome(body, footer, vi.fn());
    expect(body.querySelector('h2')?.textContent).toBe('Willkommen');
    expect(footer.querySelector('#btn-start')).toBeTruthy();
  });

  it('calls onNext when the start button is clicked', () => {
    const onNext = vi.fn();
    new Step1Welcome(body, footer, onNext);
    footer.querySelector<HTMLButtonElement>('#btn-start')?.click();
    expect(onNext).toHaveBeenCalledOnce();
  });
});
