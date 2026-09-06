import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Step2Location } from '../wizard/Step2Location';

describe('Step2Location', () => {
  let body: HTMLElement;
  let footer: HTMLElement;

  beforeEach(() => {
    localStorage.clear();
    body = document.createElement('div');
    footer = document.createElement('div');
  });

  it('renders with a disabled next button when no location is saved', () => {
    new Step2Location(body, footer, vi.fn());
    const next = footer.querySelector<HTMLButtonElement>('#btn-next');
    expect(next?.disabled).toBe(true);
    expect(body.querySelector('.location-status.err')).toBeTruthy();
  });

  it('enables the next button and shows the saved location', () => {
    localStorage.setItem('cmt_location', JSON.stringify({ lat: 48.1, lon: 11.5 }));
    new Step2Location(body, footer, vi.fn());
    const next = footer.querySelector<HTMLButtonElement>('#btn-next');
    expect(next?.disabled).toBe(false);
    expect(body.querySelector('.location-status.ok')).toBeTruthy();
  });

  it('saves a manually entered location and calls onNext', () => {
    const onNext = vi.fn();
    new Step2Location(body, footer, onNext);

    (body.querySelector('#inp-lat') as HTMLInputElement).value = '48.1374';
    (body.querySelector('#inp-lon') as HTMLInputElement).value = '11.5755';
    body.querySelector<HTMLButtonElement>('#btn-manual')?.click();

    footer.querySelector<HTMLButtonElement>('#btn-next')?.click();
    expect(onNext).toHaveBeenCalledWith({ lat: 48.1374, lon: 11.5755 });
  });
});
