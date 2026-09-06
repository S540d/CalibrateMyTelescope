import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Step4Obstacles } from '../wizard/Step4Obstacles';
import { emptyProfile } from '../lib/obstacles';

describe('Step4Obstacles', () => {
  let body: HTMLElement;
  let footer: HTMLElement;

  beforeEach(() => {
    body = document.createElement('div');
    footer = document.createElement('div');
  });

  it('renders 24 grid cells for an empty profile', () => {
    new Step4Obstacles(body, footer, emptyProfile(), vi.fn());
    expect(body.querySelectorAll('.grid-cell')).toHaveLength(24);
    expect(body.querySelectorAll('.grid-cell.blocked')).toHaveLength(0);
  });

  it('toggles a cell and passes the updated profile to onNext', () => {
    const onNext = vi.fn();
    new Step4Obstacles(body, footer, emptyProfile(), onNext);

    const cell = body.querySelector<HTMLElement>('.grid-cell[data-sector="0"][data-zone="0"]');
    cell?.click();
    expect(cell?.classList.contains('blocked')).toBe(true);

    footer.querySelector<HTMLButtonElement>('#btn-next')?.click();
    expect(onNext).toHaveBeenCalledOnce();
    expect(onNext.mock.calls[0][0][0][0]).toBe(true);
  });

  it('applies the garden preset to block the lowest zone everywhere', () => {
    new Step4Obstacles(body, footer, emptyProfile(), vi.fn());
    body.querySelector<HTMLButtonElement>('#preset-garden')?.click();
    expect(body.querySelectorAll('.grid-cell.blocked')).toHaveLength(8);
  });

  it('shows the polar map svg when toggled', () => {
    new Step4Obstacles(body, footer, emptyProfile(), vi.fn());
    expect(body.querySelector('.starmap-canvas')).toBeFalsy();
    body.querySelector<HTMLButtonElement>('#btn-toggle-map')?.click();
    expect(body.querySelector('.starmap-canvas')).toBeTruthy();
  });
});
