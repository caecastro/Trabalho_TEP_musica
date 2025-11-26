// src/services/audioDbService.js
const STATIC_IMAGES = {
  "the weeknd":
    "https://upload.wikimedia.org/wikipedia/en/a/a0/The_Weeknd_-_After_Hours.png",
  "ed sheeran":
    "https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png",
  "taylor swift":
    "https://upload.wikimedia.org/wikipedia/en/f/f6/Taylor_Swift_-_1989.png",
  "sabrina carpenter":
    "https://upload.wikimedia.org/wikipedia/en/a/a5/Sabrina_Carpenter_-_Emails_I_Can%27t_Send.png",
  "tame impala":
    "https://upload.wikimedia.org/wikipedia/en/3/30/Tame_Impala_-_Currents.png",
  radiohead:
    "https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png",
  "the marias":
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  raye: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  katseye:
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  sombr:
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  default:
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
};

// Array fixo com as 10 músicas que testamos
const POPULAR_TRACKS = [
  {
    id: "1",
    nome: "Blinding Lights",
    artista: "The Weeknd",
    genero: "Pop",
    ano: "2019",
    duracao: "3:20",
    album: "After Hours",
    thumbnail: STATIC_IMAGES["the weeknd"],
  },
  {
    id: "2",
    nome: "Shape of You",
    artista: "Ed Sheeran",
    genero: "Pop",
    ano: "2017",
    duracao: "3:53",
    album: "÷ (Divide)",
    thumbnail: STATIC_IMAGES["ed sheeran"],
  },
  {
    id: "3",
    nome: "The Fate of Ophelia",
    artista: "Taylor Swift",
    genero: "Pop",
    ano: "2023",
    duracao: "3:45",
    album: "Midnights",
    thumbnail: STATIC_IMAGES["taylor swift"],
  },
  {
    id: "4",
    nome: "Please Please",
    artista: "Sabrina Carpenter",
    genero: "Pop",
    ano: "2022",
    duracao: "3:06",
    album: "Emails I Can't Send",
    thumbnail: STATIC_IMAGES["sabrina carpenter"],
  },
  {
    id: "5",
    nome: "The Less I Know the Better",
    artista: "Tame Impala",
    genero: "Rock",
    ano: "2015",
    duracao: "3:36",
    album: "Currents",
    thumbnail: STATIC_IMAGES["tame impala"],
  },
  {
    id: "6",
    nome: "Creep",
    artista: "Radiohead",
    genero: "Rock",
    ano: "1992",
    duracao: "3:58",
    album: "Pablo Honey",
    thumbnail: STATIC_IMAGES["radiohead"],
  },
  {
    id: "7",
    nome: "No One Noticed",
    artista: "The Marías",
    genero: "Indie",
    ano: "2021",
    duracao: "3:24",
    album: "Cinema",
    thumbnail: STATIC_IMAGES["the marias"],
  },
  {
    id: "8",
    nome: "WHERE IS MY HUSBAND!",
    artista: "RAYE",
    genero: "Pop",
    ano: "2023",
    duracao: "3:12",
    album: "My 21st Century Blues",
    thumbnail: STATIC_IMAGES["raye"],
  },
  {
    id: "9",
    nome: "Gabriela",
    artista: "KATSEYE",
    genero: "K-Pop",
    ano: "2024",
    duracao: "3:18",
    album: "Debut",
    thumbnail: STATIC_IMAGES["katseye"],
  },
  {
    id: "10",
    nome: "back to friends",
    artista: "sombr",
    genero: "Indie",
    ano: "2023",
    duracao: "3:05",
    album: "unknown",
    thumbnail: STATIC_IMAGES["sombr"],
  },
];

// Retorna as 10 músicas fixas
export const getPopularTracks = async () => {
  console.log("🎵 Retornando 10 músicas fixas");
  return POPULAR_TRACKS;
};

// Busca vazia (para manter compatibilidade)
export const searchTracks = async (query) => {
  console.log(`🔍 Buscando: ${query}`);
  return [];
};

export default {
  getPopularTracks,
  searchTracks,
};
