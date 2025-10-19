// src/services/api.js
const API_BASE_URL = "https://theaudiodb.com/api/v1/json/2";

// Função para obter caminhos absolutos das imagens
const getImagePath = (imageName) => {
  return new URL(`../assets/${imageName}`, import.meta.url).href;
};

// Artistas disponíveis com caminhos absolutos das imagens
const AVAILABLE_ARTISTS = {
  "taylor swift": {
    image: getImagePath("TS.jpeg"),
    songs: [
      "Anti-Hero",
      "Shake It Off",
      "Blank Space",
      "Cardigan",
      "Love Story",
    ],
  },
  "the weeknd": {
    image: getImagePath("the_weeknd.jpeg"),
    songs: [
      "Blinding Lights",
      "Save Your Tears",
      "Starboy",
      "The Hills",
      "Call Out My Name",
    ],
  },
  "bad bunny": {
    image: getImagePath("BE.jpeg"),
    songs: [
      "Dakiti",
      "Tití Me Preguntó",
      "Me Porto Bonito",
      "Sensualidad",
      "Moscow Mule",
    ],
  },
  "ed sheeran": {
    image: getImagePath("Ed.jpeg"),
    songs: [
      "Shape of You",
      "Perfect",
      "Thinking Out Loud",
      "Photograph",
      "Bad Habits",
    ],
  },
};

export const searchTracks = async (query) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search.php?s=${encodeURIComponent(query)}`
    );
    const data = await response.json();

    if (data.artists && data.artists[0]) {
      return generateTracksFromArtist(data.artists[0]);
    }
    return generateTracksFromQuery(query);
  } catch (error) {
    console.error("Erro na busca:", error);
    return generateTracksFromQuery(query);
  }
};

export const getPopularTracks = async () => {
  const popularTracks = [];

  // Adiciona músicas de cada artista até completar 10
  Object.keys(AVAILABLE_ARTISTS).forEach((artistName) => {
    const artistData = AVAILABLE_ARTISTS[artistName];
    // Adiciona 2-3 músicas de cada artista para totalizar 10
    const songsToAdd = artistData.songs.slice(
      0,
      artistName === "taylor swift" ? 3 : artistName === "the weeknd" ? 3 : 2
    );

    songsToAdd.forEach((song, index) => {
      popularTracks.push({
        id: `${artistName}_${song.replace(/\s+/g, "_").toLowerCase()}`,
        nome: song,
        artista: formatArtistName(artistName),
        genero: getArtistGenre(artistName),
        ano: (2018 + index).toString(),
        duracao: generateRandomDuration(),
        album: `${formatArtistName(artistName)} - ${getAlbumName(
          artistName,
          index
        )}`,
        thumbnail: artistData.image, // ← Caminho absoluto da imagem
      });
    });
  });

  return popularTracks.slice(0, 10);
};

const generateTracksFromArtist = (artist) => {
  if (!artist) return [];

  const artistName = artist.strArtist.toLowerCase();
  const artistData = AVAILABLE_ARTISTS[artistName];

  if (!artistData) return [];

  return artistData.songs.slice(0, 2).map((song, index) => ({
    id: `${artistName}_${song.replace(/\s+/g, "_").toLowerCase()}`,
    nome: song,
    artista: formatArtistName(artistName),
    genero: artist.strGenre || getArtistGenre(artistName),
    ano: (2018 + index).toString(),
    duracao: generateRandomDuration(),
    album: `${formatArtistName(artistName)} - ${getAlbumName(
      artistName,
      index
    )}`,
    thumbnail: artistData.image, // ← Caminho absoluto da imagem
  }));
};

const generateTracksFromQuery = (query) => {
  const normalizedQuery = query.toLowerCase();
  const matchedArtist = Object.keys(AVAILABLE_ARTISTS).find(
    (artist) =>
      artist.includes(normalizedQuery) || normalizedQuery.includes(artist)
  );

  if (matchedArtist) {
    const artistData = AVAILABLE_ARTISTS[matchedArtist];
    return artistData.songs.slice(0, 2).map((song, index) => ({
      id: `${matchedArtist}_${song.replace(/\s+/g, "_").toLowerCase()}`,
      nome: song,
      artista: formatArtistName(matchedArtist),
      genero: getArtistGenre(matchedArtist),
      ano: (2018 + index).toString(),
      duracao: generateRandomDuration(),
      album: `${formatArtistName(matchedArtist)} - ${getAlbumName(
        matchedArtist,
        index
      )}`,
      thumbnail: artistData.image, // ← Caminho absoluto da imagem
    }));
  }

  return [];
};

// Funções auxiliares
const generateRandomDuration = () => {
  const minutes = Math.floor(Math.random() * 2) + 2; // 2-4 minutos
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const formatArtistName = (artistName) => {
  return artistName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getArtistGenre = (artistName) => {
  const genres = {
    "taylor swift": "Pop",
    "the weeknd": "R&B",
    "bad bunny": "Reggaeton",
    "ed sheeran": "Pop",
  };
  return genres[artistName] || "Pop";
};

const getAlbumName = (artistName, index) => {
  const albums = {
    "taylor swift": ["Midnights", "1989", "Folklore"],
    "the weeknd": ["After Hours", "Starboy", "Beauty Behind the Madness"],
    "bad bunny": ["Un Verano Sin Ti", "El Último Tour Del Mundo", "X 100pre"],
    "ed sheeran": ["÷", "No.6 Collaborations Project", "="],
  };
  return albums[artistName]?.[index] || "Best Hits";
};
