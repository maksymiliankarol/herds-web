const KEY = "username";

export const getUsername = () => localStorage.getItem(KEY);
export const saveUsername = (name: string) => localStorage.setItem(KEY, name);