export const en = {
  // common
  common: {
    back: 'Back',
    loading: 'Loading...',
    opensInNewTab: '(opens in new tab)',
  },

  // routes
  home: {
    cities: 'Cities',
    profile: 'My Profile',
    howItWorks: 'How It Works',
    contact: 'Contact',
    policies: 'Policies',
    settings: 'Settings',
    metalogrom: 'Metalogrom',
    opensInNewTab: '(opens in new tab)',
  },
  cities: {
    searchLabel: 'Search for your city',
    searchPlaceholder: 'Search for your city...',
    noCities: 'No cities found',
    couldNotLoad: 'Could not load cities',
  },
  city: {
    noRooms: 'No rooms yet',
    roomNotFound: 'Room not found',
    cityNotFound: 'City not found',
    couldNotLoadRooms: 'Could not load rooms',
    rooms: 'Rooms',
    closeRooms: 'Close rooms',
    news: 'News',
    chat: 'Chat',
    expandRoom: (title: string) => `Expand ${title}`,
    collapseRoom: (title: string) => `Collapse ${title}`,
  },
  myProfile: {
    nameLabel: 'Your name',
    namePlaceholder: 'Enter your name here...',
    publicNotice: "Your name is public and not verified, and everything you write in a room is visible to everyone there. Don't share personal details.",
    acceptBefore: 'By continuing you accept the ',
    terms: 'Terms',
    acceptMiddle: ' and the ',
    privacy: 'Privacy Policy',
    acceptAfter: '.',
    nameReserved: 'This name is reserved',
    nameInvalid: '2-20 characters: letters, digits, _ or -',
    save: 'Save',
  },
  settings: {
    title: 'Settings',
    language: 'Language',
  },
  howItWorks: {
    title: 'How It Works',
    intro: 'One chat for your city, split into rooms. No account needed.',
    step1: { link: 'Pick a name', after: '. No password or email needed.' },
    step2: { link: 'Find your city', after: ' and open its chat.' },
    step3: "Join a room: food, events, studies and more. Chat live and read the room's news.",
    note: 'Everything you write is public to the room, and only recent messages are kept.',
  },
  contact: {
    writeUs: 'Write us:',
  },
  policies: {
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy'
  },
  notFound: {
    title: 'Page not found',
  },
  errorPage: {
    fallback: 'Something went wrong',
  },

  // components
  chat: {
    messagesLabel: 'Messages',
    placeholder: 'Write message here...',
    send: 'Send',
    connecting: 'Connecting...',
    reconnecting: 'Reconnecting...',
    tryAgain: 'Try again',
    changeName: 'Change name',
  },
  news: {
    couldNotLoad: 'Could not load news',
    noNews: 'No news yet',
  },

  // lib
  rejections: {
    invalidName: 'This name is not valid',
    verificationFailed: 'Verification failed',
    nameTaken: 'This name is already in use in this room (another tab?)',
    roomFull: 'This room is full, try again soon',
    ipLimit: 'Too many connections from your network',
    gaveUp: 'Could not connect to the room',
    unknown: 'Could not join the room',
  },
  errors: {
    tooManyRequests: 'Too many requests, try again in a minute',
    cannotReach: 'Cannot reach the server, check your connection',
  },

  // api
  chatErrors: {
    slow_down: 'Slow down',
    too_many_messages: 'Too many messages',
    message_too_large: 'Message too large',
    invalid_json: 'Could not send the message',
    invalid_body: 'Invalid message',
  },
}

export type Messages = typeof en