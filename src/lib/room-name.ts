// "food_chinese" -> "food chinese" (the first letter is capitalised in CSS)
export const roomName = (title: string) => title.replaceAll("_", " ");