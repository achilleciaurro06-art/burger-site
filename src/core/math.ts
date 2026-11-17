export const clamp = (v: number, a = 0, b = 1): number => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const easeInOut = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** 0→1 tra a e b; se a===b è uno scalino. */
export const range = (x: number, a: number, b: number): number => (b <= a ? (x >= a ? 1 : 0) : clamp((x - a) / (b - a)));
