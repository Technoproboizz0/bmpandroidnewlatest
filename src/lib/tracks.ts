export type Track = { id: string; title: string; artist: string };

export const thumb = (id: string, q: "hq" | "mq" = "hq") =>
  `https://i.ytimg.com/vi/${id}/${q}default.jpg`;

export const TRENDING: Track[] = [
  { id: "4NRXx6U8ABQ", title: "Blinding Lights", artist: "The Weeknd" },
  { id: "kTJczUoc26U", title: "Stay", artist: "The Kid LAROI, Justin Bieber" },
  { id: "JGwWNGJdvx8", title: "Shape of You", artist: "Ed Sheeran" },
  { id: "kJQP7kiw5Fk", title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee" },
  { id: "60ItHLz5WEA", title: "Faded", artist: "Alan Walker" },
  { id: "OPf0YbXqDm0", title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
];

export const CLASSICS: Track[] = [
  { id: "fJ9rUzIMcZQ", title: "Bohemian Rhapsody", artist: "Queen" },
  { id: "YQHsXMglC9A", title: "Hello", artist: "Adele" },
  { id: "hT_nvWreIhg", title: "Counting Stars", artist: "OneRepublic" },
  { id: "RgKAFK5djSk", title: "See You Again", artist: "Wiz Khalifa ft. Charlie Puth" },
  { id: "09R8_2nJtjg", title: "Sugar", artist: "Maroon 5" },
  { id: "pRpeEdMmmQ0", title: "Shake It Off", artist: "Taylor Swift" },
];

export const ALL_TRACKS = [...TRENDING, ...CLASSICS];
