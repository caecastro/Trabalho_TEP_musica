// src/services/api.js
const API_BASE_URL = "https://theaudiodb.com/api/v1/json/2";

export const searchTracks = async (query) => {
  try {
    console.log(`🔍 Buscando artista: ${query}`);

    const response = await fetch(
      `${API_BASE_URL}/search.php?s=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("📦 Resposta da API:", data);

    // A API retorna artists mesmo se não encontrar
    if (data.artists && data.artists[0]) {
      const artist = data.artists[0];
      console.log(`🎯 Artista encontrado: ${artist.strArtist}`);
      return generateTracksFromArtist(artist);
    } else {
      console.log("❌ Artista não encontrado na API");
      return []; // Retorna array vazio se não encontrar
    }
  } catch (error) {
    console.error("🚨 Erro na busca:", error);
    return []; // Retorna array vazio em caso de erro
  }
};

export const getPopularTracks = async () => {
  try {
    console.log("🎵 Buscando artistas populares...");

    // Busca por artistas populares conhecidos
    const popularArtists = [
      "the weeknd",
      "taylor swift",
      "ed sheeran",
      "coldplay",
      "ariana grande",
    ];
    const allTracks = [];

    for (const artistName of popularArtists) {
      try {
        const tracks = await searchTracks(artistName);
        if (tracks.length > 0) {
          allTracks.push(...tracks.slice(0, 2)); // Pega até 2 músicas por artista
        }

        // Delay para não sobrecarregar a API
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.log(`Erro ao buscar ${artistName}:`, error);
      }
    }

    console.log(`✅ Encontradas ${allTracks.length} músicas`);
    return allTracks.slice(0, 10); // Retorna no máximo 10 músicas
  } catch (error) {
    console.error("🚨 Erro ao buscar músicas populares:", error);
    return [];
  }
};

// Gera tracks a partir dos dados reais da API
const generateTracksFromArtist = (artist) => {
  if (!artist) return [];

  const tracks = [];
  const artistName = artist.strArtist;

  // Gera algumas músicas fictícias baseadas no artista
  // (já que a API não retorna lista de músicas)
  const sampleSongs = generateSampleSongs(artistName);

  sampleSongs.forEach((song, index) => {
    tracks.push({
      id: `${artistName.toLowerCase().replace(/\s+/g, "_")}_${index}`,
      nome: song,
      artista: artistName,
      genero: artist.strGenre || "Pop",
      ano: (2018 + index).toString(),
      duracao: generateRandomDuration(),
      album: artist.strAlbum || `${artistName} - Album ${index + 1}`,
      thumbnail:
        artist.strArtistThumb || artist.strArtistLogo || getDefaultThumbnail(),
    });
  });

  return tracks;
};

// Gera músicas de exemplo baseadas no artista
const generateSampleSongs = (artistName) => {
  const songTemplates = {
    "the weeknd": [
      "Blinding Lights",
      "Save Your Tears",
      "Starboy",
      "The Hills",
    ],
    "taylor swift": ["Anti-Hero", "Shake It Off", "Blank Space", "Cardigan"],
    "ed sheeran": [
      "Shape of You",
      "Perfect",
      "Thinking Out Loud",
      "Photograph",
    ],
    coldplay: ["Yellow", "Fix You", "Viva La Vida", "Paradise"],
    "ariana grande": ["Thank U, Next", "7 Rings", "Positions", "Problem"],
  };

  const normalizedName = artistName.toLowerCase();
  const template = Object.keys(songTemplates).find(
    (key) => normalizedName.includes(key) || key.includes(normalizedName)
  );

  return (
    songTemplates[template] || [
      "Hit Song 1",
      "Popular Track",
      "Fan Favorite",
      "New Release",
    ]
  );
};

const generateRandomDuration = () => {
  const minutes = Math.floor(Math.random() * 2) + 2; // 2-4 minutos
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const getDefaultThumbnail = () => {
  return "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop";
};

export default {
  searchTracks,
  getPopularTracks,
};
