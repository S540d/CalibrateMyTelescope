import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Step3PolarAlignment } from '../wizard/Step3PolarAlignment';

describe('Step3PolarAlignment', () => {
  let body: HTMLElement;
  let footer: HTMLElement;

  beforeEach(() => {
    body = document.createElement('div');
    footer = document.createElement('div');
  });

  it('renders the Polaris figure and a next button', () => {
    new Step3PolarAlignment(body, footer, vi.fn());
    expect(body.querySelector('svg')).toBeTruthy();
    expect(footer.querySelector('#btn-next')).toBeTruthy();
  });

  it('calls onNext when the next button is clicked', () => {
    const onNext = vi.fn();
    new Step3PolarAlignment(body, footer, onNext);
    footer.querySelector<HTMLButtonElement>('#btn-next')?.click();
    expect(onNext).toHaveBeenCalledOnce();
  });
});
