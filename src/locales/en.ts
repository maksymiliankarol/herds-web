const en = {
  languageName: "English",
  layout: {
    home: "Home",
    cities: "Cities",
    myProfile: "My Profile",
    settings: "Settings",
    menu: "Menu",
    close: "Close menu",
  },
  cities: {
    title: "Cities",
    intro: "Find your city and join a room.",
    placeholder: "London",
    noResults: "We're not active in the city you're searching for.",
  },
  city: {
    rooms: "Rooms",
    news: "News",
    chat: "Chat",
    selectRoom: "Select a room to see chat and news.",
    noNews: "No news yet.",
    noRooms: "No rooms yet.",
  },
  profile: {
    title: "My Profile",
    intro: "Pick the name others see in chat.",
    name: "Name",
    namePlaceholder: "Alice",
    required: "Choose a name to join the chat.",
    taken: "That name is already used in this room. Pick another one.",
    rules: "3-20 letters, numbers or _",
    save: "Save",
    saved: "Saved.",
  },
  chat: {
    disconnected: "Disconnected from the room.",
    removed: "You were removed from the room by a moderator.",
    roomFull: "This room is full. Try again later.",
    tooManyConnections: "Too many connections from your network.",
    online: "online",
    type: "Type here...",
    send: "Send",
  },
  settings: {
    title: "Settings",
    intro: "Customize this app.",
    language: "Language",
  },
  errors: {
    generic: "Something went wrong. Try again.",
    badRequest: "Invalid request.",
    tooManyRequests: "Too many requests. Wait a moment and try again.",
    notFound: "Not found.",
  },
};

export type Messages = typeof en;
export default en;