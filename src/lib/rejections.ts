// Close codes: must match the server (room.ts and routes/ws.ts)
export const CLOSE_INVALID_NAME = 4400
export const CLOSE_VERIFICATION_FAILED = 4403
export const CLOSE_NAME_TAKEN = 4409
export const CLOSE_ROOM_FULL = 4429
export const CLOSE_IP_LIMIT = 4430

export type RejectionAction = 'retry' | 'change-name'

export type Rejection = { message: string; actions: RejectionAction[] }

const KNOWN: Record<number, Rejection> = {
  [CLOSE_INVALID_NAME]: {
    message: 'This name is not valid',
    actions: ['change-name'],
  },
  [CLOSE_VERIFICATION_FAILED]: {
    message: 'Verification failed',
    actions: ['retry'],
  },
  [CLOSE_NAME_TAKEN]: {
    message: 'This name is already in use in this room (another tab?)',
    actions: ['retry', 'change-name'],
  },
  [CLOSE_ROOM_FULL]: {
    message: 'This room is full, try again soon',
    actions: ['retry'],
  },
  [CLOSE_IP_LIMIT]: {
    message: 'Too many connections from your network',
    actions: ['retry'],
  },
}

// serverText is the reason the server sent. It's only shown for codes we don't know.
export function describeRejection(code: number, serverText?: string): Rejection {
  return KNOWN[code] ?? { message: serverText || 'Could not join the room', actions: ['retry'] }
}