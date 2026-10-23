const KEY = 'herds:name'

// must match the server (Room class): letters, digits, _ and -, 2-20 chars
const NAME_PATTERN = /^[\p{L}\p{N}_-]{2,20}$/u
// Keep in sync with the server (herds-api src/lib/names.ts)
const RESERVED = [
  "admin", "administrator", "moderator", "mod", "staff", "support",
  "system", "owner", "official", "root", "bot", "herds", "metalogrom",
];

export const isReservedName = (name: string) =>
  RESERVED.includes(name.normalize("NFKC").toLowerCase().replace(/[_-]/g, ""));

export const isValidName = (name: string) => NAME_PATTERN.test(name) && !isReservedName(name)

export function getProfileName(): string | null {
  try {
    const name = localStorage.getItem(KEY)
    return name && isValidName(name) ? name : null
  } catch {
    return null // storage can be blocked
  }
}

export function setProfileName(name: string) {
  localStorage.setItem(KEY, name)
}