export type DragScrollState = {
  isDragging: boolean;
  startX: number;
  scrollLeft: number;
  hasDragged: boolean;
  rafActive: boolean;
  lastPageX: number;
};

export function initDragState(): DragScrollState {
  return {
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
    hasDragged: false,
    rafActive: false,
    lastPageX: 0,
  };
}

export function onDragStart(
  state: DragScrollState,
  slider: HTMLDivElement,
  pageX: number,
) {
  state.isDragging = true;
  state.hasDragged = false;
  state.startX = pageX - slider.offsetLeft;
  state.scrollLeft = slider.scrollLeft;
  state.lastPageX = pageX;
  slider.classList.add('is-dragging');
}

export function onDragMove(
  state: DragScrollState,
  slider: HTMLDivElement,
  pageX: number,
) {
  state.lastPageX = pageX;
  if (state.rafActive) return;
  state.rafActive = true;
  requestAnimationFrame(() => applyDragFrame(state, slider));
}

function applyDragFrame(state: DragScrollState, slider: HTMLDivElement) {
  if (!state.isDragging) return void (state.rafActive = false);
  const x = state.lastPageX - slider.offsetLeft;
  const walk = (x - state.startX) * 1.5;
  if (Math.abs(walk) > 5) state.hasDragged = true;
  slider.scrollLeft = state.scrollLeft - walk;
  state.rafActive = false;
}

export function onDragEnd(state: DragScrollState, slider: HTMLDivElement) {
  state.isDragging = false;
  state.rafActive = false;
  slider.classList.remove('is-dragging');
}
