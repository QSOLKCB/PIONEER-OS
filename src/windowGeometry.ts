// SPDX-License-Identifier: Apache-2.0
// All coordinates are relative to the full browser viewport and match styles.css.
// The tablet layout is viewport minus 103px wide; keep its titlebar reachable.
export interface WindowVisibility {
  open: boolean;
  minimized: boolean;
}

/** Unlike a closed window, a minimized window stays mounted with its state. */
export function shouldMountWindow(state?: WindowVisibility): boolean {
  return Boolean(state?.open);
}

/** Fit a floating window inside the visible desktop, above the taskbar. */
export function fitWindowPosition(
  requestedX: number, requestedY: number, viewportWidth: number, viewportHeight: number
): { x: number; y: number } {
  const width = Number.isFinite(viewportWidth) ? Math.max(320, viewportWidth) : 1280;
  const height = Number.isFinite(viewportHeight) ? Math.max(400, viewportHeight) : 720;
  // At this breakpoint CSS deliberately places every window in a fixed stack.
  if (width <= 620) return { x: 61, y: 56 };

  const windowWidth = width <= 900 ? width - 103 : Math.min(840, width - 115);
  const windowHeight = width <= 900 ? height - 150 : Math.min(660, height - 135);
  const minX = 87; // sidebar width (82px) plus a safe gap
  const minY = 59; // topbar (56px) plus a safe gap
  const maxX = Math.max(minX, width - windowWidth - 8);
  const maxY = Math.max(minY, height - windowHeight - 66);
  const x = Number.isFinite(requestedX) ? requestedX : minX;
  const y = Number.isFinite(requestedY) ? requestedY : minY;
  return { x: Math.min(maxX, Math.max(minX, x)), y: Math.min(maxY, Math.max(minY, y)) };
}
