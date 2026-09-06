import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Step5Stars } from '../wizard/Step5Stars';
import { presetGarden, emptyProfile } from '../lib/obstacles';

describe('Step5Stars', () => {
  let body: HTMLElement;
  let footer: HTMLElement;

  beforeEach(() => {
    body = document.createElement('div');
    footer = document.createElement('div');
    // fix "now" so star altitude/azimuth calculations are deterministic
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-06T21:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a star list for an unobstructed horizon', () => {
    new Step5Stars(body, footer, emptyProfile(), { lat: 48.1, lon: 11.6 }, vi.fn());
    expect(body.querySelectorAll('.star-item').length).toBeGreaterThan(0);
  });

  it('shows the location fallback hint when no location is given', () => {
    new Step5Stars(body, footer, emptyProfile(), null, vi.fn());
    expect(body.textContent).toContain('48°N');
  });

  it('shows a fallback message when no stars qualify', () => {
    // block every sector/zone → nothing visible
    const blocked = presetGarden().map(s => s.map(() => true));
    new Step5Stars(body, footer, blocked, { lat: 48.1, lon: 11.6 }, vi.fn());
    expect(body.querySelectorAll('.star-item')).toHaveLength(0);
    expect(body.textContent).toContain('Keine geeigneten Sterne gefunden');
  });

  it('calls onNext when the next button is clicked', () => {
    const onNext = vi.fn();
    new Step5Stars(body, footer, emptyProfile(), { lat: 48.1, lon: 11.6 }, onNext);
    footer.querySelector<HTMLButtonElement>('#btn-next')?.click();
    expect(onNext).toHaveBeenCalledOnce();
  });
});
