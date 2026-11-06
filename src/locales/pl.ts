import type { Messages } from "./en";

const pl: Messages = {
  languageName: "Polski",
  layout: {
    home: "Strona główna",
    cities: "Miasta",
    myProfile: "Mój profil",
    settings: "Ustawienia",
    menu: "Menu",
    close: "Zamknij menu",
  },
  cities: {
    title: "Miasta",
    intro: "Znajdź swoje miasto i dołącz do pokoju.",
    placeholder: "Kraków",
    noResults: "Nie działamy jeszcze w mieście, którego szukasz.",
  },
  city: {
    rooms: "Pokoje",
    news: "Wiadomości",
    chat: "Czat",
    selectRoom: "Wybierz pokój, aby zobaczyć czat i wiadomości.",
    noNews: "Brak wiadomości.",
    noRooms: "Brak pokoi.",
  },
  profile: {
    title: "Mój profil",
    intro: "Wybierz nazwę, którą inni widzą na czacie.",
    name: "Nazwa",
    namePlaceholder: "Alicja",
    required: "Wybierz nazwę, aby dołączyć do czatu.",
    taken: "Ta nazwa jest już używana w tym pokoju. Wybierz inną.",
    rules: "3-20 liter, cyfr lub _",
    save: "Zapisz",
    saved: "Zapisano.",
  },
  chat: {
    disconnected: "Rozłączono z pokojem.",
    online: "online",
  },
  settings: {
    title: "Ustawienia",
    intro: "Dostosuj aplikację.",
    language: "Język",
  },
  errors: {
    generic: "Coś poszło nie tak. Spróbuj ponownie.",
    badRequest: "Nieprawidłowe żądanie.",
    tooManyRequests: "Zbyt wiele żądań. Poczekaj chwilę i spróbuj ponownie.",
    notFound: "Nie znaleziono.",
  },
};

export default pl;