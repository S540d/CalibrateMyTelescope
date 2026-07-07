export function requireElement(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Expected element #${id} to exist`);
  return el;
}
