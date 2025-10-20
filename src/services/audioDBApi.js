// src/services/audioDbService.js - COM URLs FUNCIONAIS E CORRIGIDAS
const API_BASE_URL = "https://theaudiodb.com/api/v1/json/2";

// CAPAS DE ÁLBUNS COM URLs DIRETAS E FUNCIONAIS
const ALBUM_COVERS = {
  // The Weeknd - After Hours
  "Blinding Lights":
    "https://upload.wikimedia.org/wikipedia/en/a/a0/The_Weeknd_-_After_Hours.png",

  // Ed Sheeran - Divide
  "Shape of You":
    "https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png",

  // Billie Eilish - When We All Fall Asleep, Where Do We Go?
  "Bad Guy":
    "https://upload.wikimedia.org/wikipedia/en/6/6e/When_We_All_Fall_Asleep%2C_Where_Do_We_Go%3F.png",

  // Queen - A Night at the Opera
  "Bohemian Rhapsody":
    "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png",

  // Drake - Scorpion
  "God's Plan":
    "https://upload.wikimedia.org/wikipedia/en/9/90/Scorpion_by_Drake.jpg",

  // Taylor Swift - 1989
  "Shake It Off":
    "https://upload.wikimedia.org/wikipedia/en/f/f6/Taylor_Swift_-_1989.png",

  // Ariana Grande - Thank U, Next
  "Thank U, Next":
    "https://upload.wikimedia.org/wikipedia/en/d/dd/Thank_U%2C_Next_album_cover.png",

  // The Beatles - Hey Jude (compilation album)
  "Hey Jude":
    "https://upload.wikimedia.org/wikipedia/en/5/5f/Hey_Jude_album_cover.jpg",

  // Led Zeppelin - IV
  "Stairway to Heaven":
    "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg",

  // Rolling Stones - Aftermath
  "Paint It Black":
    "https://upload.wikimedia.org/wikipedia/en/3/31/Aftermath_UK.jpg",
};

// Mapeamento de gêneros
const ARTIST_GENRES = {
  "the weeknd": "Pop",
  "ed sheeran": "Pop",
  "billie eilish": "Pop",
  queen: "Rock",
  drake: "Hip-Hop",
  "taylor swift": "Pop",
  "ariana grande": "Pop",
  "the beatles": "Rock",
  "led zeppelin": "Rock",
  "rolling stones": "Rock",
};

// Função para obter capa do álbum
const getAlbumCover = (songName, artistName) => {
  const songKey = songName.toLowerCase();

  console.log(`🔍 Buscando capa para: "${songName}"`);

  for (const [coverSong, coverUrl] of Object.entries(ALBUM_COVERS)) {
    if (songKey.includes(coverSong.toLowerCase())) {
      console.log(`🎵 Encontrada capa para: ${songName} -> ${coverUrl}`);
      return coverUrl;
    }
  }

  console.log(`⚠️ Usando fallback para: ${songName}`);
  return "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop";
};

// Função para obter gênero
const getGenreForArtist = (artistName) => {
  const lowerName = artistName.toLowerCase();
  for (const [key, genre] of Object.entries(ARTIST_GENRES)) {
    if (lowerName.includes(key)) {
      return genre;
    }
  }
  return "Pop";
};

// Função de busca mock
export const searchTracks = async (query) => {
  try {
    console.log("🔍 Buscando:", query);
    return [
      {
        id: `mock_${query}`,
        nome: query,
        artista: query,
        genero: getGenreForArtist(query),
        ano: "2020",
        duracao: "3:30",
        album: `${query} - Album`,
        thumbnail: getAlbumCover(query, query),
      },
    ];
  } catch (error) {
    console.error("💥 Erro:", error);
    return [];
  }
};

// Função com top 10 músicas
export const getPopularTracks = async () => {
  console.log("🔥 Carregando TOP 10 da semana...");

  const popularTracks = [
    {
      id: "1",
      nome: "Blinding Lights",
      artista: "The Weeknd",
      genero: "Pop",
      ano: "2019",
      duracao: "3:20",
      album: "After Hours",
      thumbnail:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFAomz46B0SEfIbAnDkzk9_OBL1XKYskKQhw&s",
    },
    {
      id: "2",
      nome: "Shape of You",
      artista: "Ed Sheeran",
      genero: "Pop",
      ano: "2017",
      duracao: "3:53",
      album: "÷ (Divide)",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png",
    },
    {
      id: "3",
      nome: "Bad Guy",
      artista: "Billie Eilish",
      genero: "Pop",
      ano: "2019",
      duracao: "3:14",
      album: "When We All Fall Asleep, Where Do We Go?",
      thumbnail: "https://i1.sndcdn.com/artworks-gsV30RRzouSi-0-t1080x1080.jpg",
    },
    {
      id: "4",
      nome: "Bohemian Rhapsody",
      artista: "Queen",
      genero: "Rock",
      ano: "1975",
      duracao: "5:55",
      album: "A Night at the Opera",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png",
    },
    {
      id: "5",
      nome: "God's Plan",
      artista: "Drake",
      genero: "Hip-Hop",
      ano: "2018",
      duracao: "3:18",
      album: "Scorpion",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/en/9/90/Scorpion_by_Drake.jpg",
    },
    {
      id: "6",
      nome: "Shake It Off",
      artista: "Taylor Swift",
      genero: "Pop",
      ano: "2014",
      duracao: "3:39",
      album: "1989",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/en/f/f6/Taylor_Swift_-_1989.png",
    },
    {
      id: "7",
      nome: "Thank U, Next",
      artista: "Ariana Grande",
      genero: "Pop",
      ano: "2018",
      duracao: "3:27",
      album: "Thank U, Next",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/en/d/dd/Thank_U%2C_Next_album_cover.png",
    },
    {
      id: "8",
      nome: "Hey Jude",
      artista: "The Beatles",
      genero: "Rock",
      ano: "1968",
      duracao: "7:11",
      album: "Hey Jude",
      thumbnail:
        "https://cdn-images.dzcdn.net/images/cover/9ef8134abe2e9e87676368a6cffff863/0x1900-000000-80-0-0.jpg",
    },
    {
      id: "9",
      nome: "Stairway to Heaven",
      artista: "Led Zeppelin",
      genero: "Rock",
      ano: "1971",
      duracao: "8:02",
      album: "Led Zeppelin IV",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg",
    },
    {
      id: "10",
      nome: "Paint It Black",
      artista: "The Rolling Stones",
      genero: "Rock",
      ano: "1966",
      duracao: "3:45",
      album: "Aftermath",
      thumbnail:
        "https://cdn-images.dzcdn.net/images/cover/5b73c5922e112670faf4044149269175/1900x1900-000000-80-0-0.jpg",
    },
  ];

  console.log(`🎉 Retornando ${popularTracks.length} músicas do TOP 10`);
  //e-cdns-images.dzcdn.net/images/cover/5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a/300x300-000000-80-0-0.jpg
  https: popularTracks.forEach((track) => {
    console.log(`📀 ${track.nome}: ${track.thumbnail}`);
  });

  return popularTracks;
};
