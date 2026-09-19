export function requireElement(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Expected element #${id} to exist`);
  return el;
}

export interface NextButtonOptions {
  id?: string;
  disabled?: boolean;
}

/**
 * Renders the standard "Weiter"-style primary button into a wizard step's
 * footer and wires its click handler — scoped to `footer` so step IDs don't
 * need to stay globally unique.
 */
export function renderNextButton(
  footer: HTMLElement,
  label: string,
  onClick: () => void,
  options: NextButtonOptions = {},
): void {
  const id = options.id ?? 'btn-next';
  footer.innerHTML = `<button class="btn btn-primary" id="${id}" ${options.disabled ? 'disabled' : ''}>${label}</button>`;
  footer.querySelector<HTMLButtonElement>(`#${id}`)?.addEventListener('click', onClick);
}
