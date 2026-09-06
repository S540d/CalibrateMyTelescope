import { describe, it, expect, vi } from 'vitest';
import { requireElement, renderNextButton } from '../lib/dom';

describe('requireElement', () => {
  it('returns the element when present', () => {
    const el = document.createElement('div');
    el.id = 'present';
    document.body.appendChild(el);
    expect(requireElement('present')).toBe(el);
    el.remove();
  });

  it('throws when the element is missing', () => {
    expect(() => requireElement('missing')).toThrow();
  });
});

describe('renderNextButton', () => {
  it('renders a primary button with the given label and default id', () => {
    const footer = document.createElement('div');
    renderNextButton(footer, 'Weiter →', vi.fn());
    const btn = footer.querySelector('#btn-next');
    expect(btn?.textContent).toBe('Weiter →');
    expect(btn?.className).toBe('btn btn-primary');
  });

  it('wires the click handler scoped to the footer element', () => {
    const footer = document.createElement('div');
    const onClick = vi.fn();
    renderNextButton(footer, 'Weiter →', onClick);
    footer.querySelector<HTMLButtonElement>('#btn-next')?.click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('supports a custom id and disabled state', () => {
    const footer = document.createElement('div');
    renderNextButton(footer, 'Los', vi.fn(), { id: 'btn-start', disabled: true });
    const btn = footer.querySelector<HTMLButtonElement>('#btn-start');
    expect(btn).toBeTruthy();
    expect(btn?.disabled).toBe(true);
  });
});
