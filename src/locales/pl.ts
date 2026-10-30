import type { Messages } from './en'

export const pl: Messages = {
  // common
  common: {
    back: 'Wstecz',
    loading: 'Ładowanie...',
    opensInNewTab: '(otwiera się w nowej karcie)',
  },

  // routes
  home: {
    cities: 'Miasta',
    profile: 'Mój profil',
    howItWorks: 'Jak to działa',
    contact: 'Kontakt',
    policies: 'Regulaminy',
    settings: 'Ustawienia',
    metalogrom: 'Metalogrom',
  },
  cities: {
    searchLabel: 'Wyszukaj swoje miasto',
    searchPlaceholder: 'Wyszukaj swoje miasto...',
    noCities: 'Nie znaleziono miast',
    couldNotLoad: 'Nie udało się wczytać miast',
  },
  city: {
    noRooms: 'Brak pokoi',
    roomNotFound: 'Nie znaleziono pokoju',
    couldNotLoadRooms: 'Nie udało się wczytać pokoi',
    rooms: 'Pokoje',
    closeRooms: 'Zamknij listę pokoi',
    news: 'Aktualności',
    chat: 'Czat',
    expandRoom: (title: string) => `Rozwiń: ${title}`,
    collapseRoom: (title: string) => `Zwiń: ${title}`,
  },
  myProfile: {
    nameLabel: 'Twoje imię',
    namePlaceholder: 'Wpisz tutaj swoje imię...',
    acceptBefore: 'Kontynuując, akceptujesz ',
    terms: 'Regulamin',
    acceptMiddle: ' i ',
    privacy: 'Politykę prywatności',
    acceptAfter: '.',
    publicNotice: 'Twoje imię jest publiczne i niezweryfikowane, a wszystko, co piszesz w pokoju, widzą wszyscy jego uczestnicy. Nie podawaj danych osobowych.',
    nameReserved: 'To imię jest zarezerwowane',
    nameInvalid: '2-20 znaków: litery, cyfry, _ lub -',
    save: 'Zapisz',
  },
  settings: {
    title: 'Ustawienia',
    language: 'Język',
  },
  howItWorks: {
    title: 'Jak to działa',
    intro: 'Jeden czat dla twojego miasta, podzielony na pokoje. Bez zakładania konta.',
    step1: { link: 'Wybierz imię', after: '. Bez hasła i adresu e-mail.' },
    step2: { link: 'Znajdź swoje miasto', after: ' i otwórz jego czat.' },
    step3: 'Wejdź do pokoju: jedzenie, wydarzenia, studia i nie tylko. Czatuj na żywo i czytaj aktualności pokoju.',
    note: 'Wszystko, co piszesz, jest publiczne w pokoju, a przechowujemy tylko ostatnie wiadomości.',
  },
  contact: {
    writeUs: 'Napisz do nas:',
  },
  policies: {
    termsOfService: 'Warunki korzystania',
    privacyPolicy: 'Polityka prywatności'
  },
  notFound: {
    title: 'Nie znaleziono strony',
  },
  errorPage: {
    fallback: 'Coś poszło nie tak',
  },

  // components
  chat: {
    messagesLabel: 'Wiadomości',
    placeholder: 'Napisz wiadomość...',
    send: 'Wyślij',
    connecting: 'Łączenie...',
    reconnecting: 'Ponowne łączenie...',
    tryAgain: 'Spróbuj ponownie',
    changeName: 'Zmień imię',
  },
  news: {
    couldNotLoad: 'Nie udało się wczytać aktualności',
    noNews: 'Brak aktualności',
  },

  // lib
  rejections: {
    invalidName: 'To imię jest nieprawidłowe',
    verificationFailed: 'Weryfikacja nie powiodła się',
    nameTaken: 'To imię jest już używane w tym pokoju (inna karta?)',
    roomFull: 'Ten pokój jest pełny, spróbuj za chwilę',
    ipLimit: 'Zbyt wiele połączeń z Twojej sieci',
    gaveUp: 'Nie udało się połączyć z pokojem',
    unknown: 'Nie udało się dołączyć do pokoju',
  },
  errors: {
    rate_limited: 'Zbyt wiele żądań, spróbuj za minutę',
    city_not_found: 'Nie znaleziono miasta',
    room_not_found: 'Nie znaleziono pokoju',
    network: 'Brak połączenia z serwerem, sprawdź internet',
  },

  chatErrors: {
    slow_down: 'Zwolnij',
    too_many_messages: 'Zbyt wiele wiadomości',
    message_too_large: 'Wiadomość jest za długa',
    invalid_json: 'Nie udało się wysłać wiadomości',
    invalid_body: 'Nieprawidłowa wiadomość',
  },
}