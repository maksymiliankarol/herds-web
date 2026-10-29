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
    policies: 'Zasady',
    settings: 'Ustawienia',
    metalogrom: 'Metalogrom',
    opensInNewTab: '(otwiera się w nowej karcie)',
  },
  cities: {
    searchLabel: 'Wyszukaj swoje miasto',
    searchPlaceholder: 'Wyszukaj swoje miasto...',
    noCities: 'Nie znaleziono miast',
  },
  city: {
    noRooms: 'Brak pokoi',
    roomNotFound: 'Nie znaleziono pokoju',
    cityNotFound: 'Nie znaleziono miasta',
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
}