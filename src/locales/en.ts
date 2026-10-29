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
}

export type Messages = typeof en