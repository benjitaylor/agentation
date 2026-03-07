export type ActivationShortcutModifier = "mod" | "shift" | "alt";
export type ShortcutPlatform = "mac" | "other";

export type ActivationShortcut = {
  key: string;
  modifiers: ActivationShortcutModifier[];
};

const MODIFIER_ORDER: ActivationShortcutModifier[] = ["mod", "shift", "alt"];
const MODIFIER_KEYS = new Set([
  "meta",
  "os",
  "control",
  "ctrl",
  "shift",
  "alt",
]);

export const DEFAULT_ACTIVATION_SHORTCUT: ActivationShortcut = {
  key: "F",
  modifiers: ["mod", "shift"],
};

function normalizeKey(key: string): string | null {
  const trimmedKey = key.trim();
  if (!trimmedKey) return null;

  const lowered = trimmedKey.toLowerCase();
  if (MODIFIER_KEYS.has(lowered)) return null;

  if (trimmedKey.length === 1) {
    return trimmedKey.toUpperCase();
  }

  return trimmedKey.length <= 12
    ? `${trimmedKey[0].toUpperCase()}${trimmedKey.slice(1)}`
    : null;
}

function normalizeModifiers(
  modifiers: ActivationShortcutModifier[],
): ActivationShortcutModifier[] {
  return MODIFIER_ORDER.filter((modifier) => modifiers.includes(modifier));
}

export function detectShortcutPlatform(): ShortcutPlatform {
  if (typeof navigator === "undefined") return "other";

  const platform =
    navigator.platform ||
    // navigator.userAgentData is not available in all environments yet.
    navigator.userAgent ||
    "";

  return /mac/i.test(platform) ? "mac" : "other";
}

export function normalizeActivationShortcut(
  shortcut: ActivationShortcut,
): ActivationShortcut {
  const key = normalizeKey(shortcut.key) ?? DEFAULT_ACTIVATION_SHORTCUT.key;

  return {
    key,
    modifiers: normalizeModifiers(shortcut.modifiers),
  };
}

function getPressedModifiers(event: Pick<KeyboardEvent, "metaKey" | "ctrlKey" | "shiftKey" | "altKey">): ActivationShortcutModifier[] {
  const modifiers: ActivationShortcutModifier[] = [];

  if (event.metaKey || event.ctrlKey) modifiers.push("mod");
  if (event.shiftKey) modifiers.push("shift");
  if (event.altKey) modifiers.push("alt");

  return normalizeModifiers(modifiers);
}

export function eventToActivationShortcut(
  event: Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey" | "shiftKey" | "altKey">,
  _platform: ShortcutPlatform = detectShortcutPlatform(),
): ActivationShortcut | null {
  const key = normalizeKey(event.key);
  if (!key) return null;

  const modifiers = getPressedModifiers(event);
  if (!modifiers.includes("mod")) return null;

  return {
    key,
    modifiers,
  };
}

export function matchesActivationShortcut(
  event: Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey" | "shiftKey" | "altKey">,
  shortcut: ActivationShortcut,
  _platform: ShortcutPlatform = detectShortcutPlatform(),
): boolean {
  const normalizedShortcut = normalizeActivationShortcut(shortcut);
  const eventShortcut = eventToActivationShortcut(event);

  if (!eventShortcut) return false;

  return (
    eventShortcut.key === normalizedShortcut.key &&
    eventShortcut.modifiers.length === normalizedShortcut.modifiers.length &&
    eventShortcut.modifiers.every(
      (modifier, index) => modifier === normalizedShortcut.modifiers[index],
    )
  );
}

export function formatActivationShortcut(
  shortcut: ActivationShortcut,
  platform: ShortcutPlatform = detectShortcutPlatform(),
): string {
  const normalizedShortcut = normalizeActivationShortcut(shortcut);
  const labels: Record<ActivationShortcutModifier, string> = {
    mod: platform === "mac" ? "Cmd" : "Ctrl",
    shift: "Shift",
    alt: platform === "mac" ? "Option" : "Alt",
  };

  return [
    ...normalizedShortcut.modifiers.map((modifier) => labels[modifier]),
    normalizedShortcut.key,
  ].join(" + ");
}
