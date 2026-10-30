import type { Messages } from '../locales/en'

// Close codes: must match the server (room.ts and routes/ws.ts)
export const CLOSE_INVALID_NAME = 4400
export const CLOSE_VERIFICATION_FAILED = 4403
export const CLOSE_NAME_TAKEN = 4409
export const CLOSE_ROOM_FULL = 4429
export const CLOSE_IP_LIMIT = 4430
export const MAX_FAILED_CONNECTS = 3

export type RejectionAction = 'retry' | 'change-name'

export type Rejection = {
  key: keyof Messages['rejections']
  actions: RejectionAction[]
}

const KNOWN: Record<number, Rejection> = {
  [CLOSE_INVALID_NAME]: { key: 'invalidName', actions: ['change-name'] },
  [CLOSE_VERIFICATION_FAILED]: { key: 'verificationFailed', actions: ['retry'] },
  [CLOSE_NAME_TAKEN]: { key: 'nameTaken', actions: ['retry', 'change-name'] },
  [CLOSE_ROOM_FULL]: { key: 'roomFull', actions: ['retry'] },
  [CLOSE_IP_LIMIT]: { key: 'ipLimit', actions: ['retry'] },
}

export const describeRejection = (code: number): Rejection =>
  KNOWN[code] ?? { key: 'unknown', actions: ['retry'] }

export const GAVE_UP: Rejection = { key: 'gaveUp', actions: ['retry'] }

export const rejectionText = (t: Messages, r: Rejection) => t.rejections[r.key]