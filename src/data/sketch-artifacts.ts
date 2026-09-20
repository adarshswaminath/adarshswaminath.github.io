/**
 * Shared configs for gutter sketch easter eggs (campfire, chest, door).
 * Behavior quirks live in sketch-artifact.ts effects keyed by `key`.
 */

export type SketchArtifactSide = 'left' | 'right'
export type SketchArtifactVariant = 'margin' | 'divider'

export type SketchArtifactSound = {
  src: string
  /** Loop while active (campfire). */
  loop?: boolean
  /**
   * - `toggle` — every click (chest unlock)
   * - `activate` — only when turning on (door gunshot)
   * - `active-loop` — start on activate, stop on deactivate (campfire)
   */
  mode: 'toggle' | 'activate' | 'active-loop'
}

export type SketchArtifactImages = {
  off: string
  on: string
  alt: string
  /** Shake the box before swapping (chest / door). */
  shake?: boolean
}

export type SketchArtifactPreset = {
  key: string
  defaultId: string
  side: SketchArtifactSide
  /** Margin vertical bias, e.g. '48%' */
  top: string
  /** Handwritten label tilt in degrees */
  tilt: number
  labels: { off: string; on: string; spent?: string }
  aria: {
    triggerOff: string
    triggerOn: string
    triggerSpent?: string
    boxOff: string
    boxOn: string
    boxSpent?: string
  }
  /** `pressed` → aria-pressed; `expanded` → aria-expanded */
  toggleAttr: 'pressed' | 'expanded'
  sound: SketchArtifactSound
  /** Image swap visual. Omit when using a custom slot (campfire SVG). */
  images?: SketchArtifactImages
  /** Class toggled on root when active (`is-lit` / `is-open`). */
  activeClass: string
  /** Fire once — further clicks do nothing (monster door). */
  once?: boolean
  /** After activating, auto-reset visual without undoing the effect. */
  autoCloseMs?: number
  /**
   * Optional named side-effect handled in sketch-artifact.ts
   * (keeps configs serializable — no functions in data).
   */
  effect?: 'monster-door'
}

export const sketchArtifacts = {
  campfire: {
    key: 'campfire',
    defaultId: 'campfire-artifact',
    side: 'left',
    top: '52%',
    tilt: 2.5,
    labels: {
      off: '[light the campfire]',
      on: '[douse the fire]',
    },
    aria: {
      triggerOff: 'Light the campfire',
      triggerOn: 'Douse the campfire',
      boxOff: 'Campfire, currently out',
      boxOn: 'Campfire, burning',
    },
    toggleAttr: 'pressed',
    sound: { src: '/campfire.mp3', loop: true, mode: 'active-loop' },
    activeClass: 'is-lit',
  },
  'treasure-chest': {
    key: 'treasure-chest',
    defaultId: 'treasure-chest-artifact',
    side: 'right',
    top: '48%',
    tilt: -3,
    labels: {
      off: '[Open the chest!]',
      on: '[Close the chest!]',
    },
    aria: {
      triggerOff: 'Open the treasure chest',
      triggerOn: 'Close the treasure chest',
      boxOff: 'Treasure chest, closed',
      boxOn: 'Treasure chest, open',
    },
    toggleAttr: 'expanded',
    sound: { src: '/unlock.mp3', mode: 'toggle' },
    images: {
      off: '/trussure-chest.png',
      on: '/trussure-chest-open.png',
      alt: 'treasure chest',
      shake: true,
    },
    activeClass: 'is-open',
  },
  'monster-door': {
    key: 'monster-door',
    defaultId: 'monster-door-artifact',
    side: 'left',
    top: '48%',
    tilt: 2.5,
    labels: {
      off: "[don't open]",
      on: '[!!!]',
      spent: '[too late...]',
    },
    aria: {
      triggerOff: "Don't open the door",
      triggerOn: 'Monster door is open',
      triggerSpent: 'The door already opened',
      boxOff: 'Monster door, closed',
      boxOn: 'Monster door, open',
      boxSpent: 'Monster door, sealed shut',
    },
    toggleAttr: 'expanded',
    sound: { src: '/gunshot.mp3', mode: 'activate' },
    images: {
      off: '/door.png',
      on: '/door-open.png',
      alt: 'closed door',
      shake: true,
    },
    activeClass: 'is-open',
    effect: 'monster-door',
    once: true,
    autoCloseMs: 1400,
  },
} as const satisfies Record<string, SketchArtifactPreset>

export type SketchArtifactKey = keyof typeof sketchArtifacts

export function getSketchArtifact(
  key: SketchArtifactKey,
): SketchArtifactPreset {
  return sketchArtifacts[key]
}
