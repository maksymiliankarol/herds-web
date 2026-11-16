const KEY = "herds-username";

export const getUsername = () => localStorage.getItem(KEY);
export const setUsername = (name: string) => localStorage.setItem(KEY, name);