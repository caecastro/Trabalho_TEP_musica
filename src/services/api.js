// src/services/api.js
const API_BASE_URL = "https://theaudiodb.com/api/v1/json/2";
const CORS_PROXY = "https://corsproxy.io";

// ===== CONFIGURAÇÕES =====
const POPULAR_ARTISTS = [
  "coldplay",
  "the weeknd",
  "taylor swift",
  "ed sheeran",
  "ariana grande",
  "bruno mars",
  "drake",
  "billie eilish",
  "maroon 5",
  "adele",
];

const ARTIST_TOP_TRACKS = {
  coldplay: ["Yellow", "The Scientist", "Viva La Vida", "Fix You", "Paradise"],
  "the weeknd": [
    "Blinding Lights",
    "Save Your Tears",
    "Starboy",
    "Can't Feel My Face",
    "Die For You",
  ],
  "taylor swift": [
    "Shake It Off",
    "Love Story",
    "Blank Space",
    "Bad Blood",
    "Anti-Hero",
  ],
  "ed sheeran": [
    "Shape of You",
    "Perfect",
    "Thinking Out Loud",
    "Photograph",
    "Castle on the Hill",
  ],
  "ariana grande": [
    "Thank U, Next",
    "7 Rings",
    "Positions",
    "Problem",
    "Side to Side",
  ],
  "bruno mars": [
    "Uptown Funk",
    "Just the Way You Are",
    "Locked Out of Heaven",
    "Grenade",
    "That's What I Like",
  ],
  drake: [
    "God's Plan",
    "Hotline Bling",
    "In My Feelings",
    "One Dance",
    "Started From the Bottom",
  ],
  "billie eilish": [
    "Bad Guy",
    "Ocean Eyes",
    "Happier Than Ever",
    "When the Party's Over",
    "Lovely",
  ],
  "maroon 5": [
    "Sugar",
    "Girls Like You",
    "Moves Like Jagger",
    "Payphone",
    "Memories",
  ],
  adele: [
    "Hello",
    "Rolling in the Deep",
    "Someone Like You",
    "Set Fire to the Rain",
    "Easy On Me",
  ],
  keane: [
    "Somewhere Only We Know",
    "Everybody's Changing",
    "Bedshaped",
    "This Is The Last Time",
    "Is It Any Wonder?",
  ],
};

// ===== FUNÇÕES PRINCIPAIS =====

/**
 * Busca artistas na API TheAudioDB
 * @param {string} query - Nome do artista para buscar
 * @returns {Promise<Array>} Array de tracks do artista
 */
export const searchTracks = async (query) => {
  try {
    console.log(`🔍 Buscando artista: ${query}`);

    const response = await fetch(
      `${CORS_PROXY}/?${encodeURIComponent(
        `${API_BASE_URL}/search.php?s=${query}`
      )}`
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data.artists?.[0]) {
      const artist = data.artists[0];
      console.log(`🎯 Artista encontrado: ${artist.strArtist}`);
      return formatArtistData(artist);
    } else {
      console.log("❌ Artista não encontrado na API, usando fallback");
      return formatArtistData(createFallbackArtist(query));
    }
  } catch (error) {
    console.error("🚨 Erro na busca:", error);
    console.log("🔄 Usando dados fallback devido ao erro");
    return formatArtistData(createFallbackArtist(query));
  }
};

/**
 * Busca as 10 músicas populares da API
 * @returns {Promise<Array>} Array com 10 tracks populares
 */
export const getPopularTracks = async () => {
  try {
    console.log("🎵 Buscando 10 artistas populares da API...");
    const allTracks = [];

    for (let i = 0; i < POPULAR_ARTISTS.length && allTracks.length < 10; i++) {
      const artistName = POPULAR_ARTISTS[i];

      try {
        console.log(`📡 Buscando: ${artistName}`);
        const tracks = await searchTracks(artistName);

        if (tracks.length > 0) {
          allTracks.push(...tracks);
          console.log(`✅ ${artistName} adicionado`);
        }

        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.log(`❌ Erro ao buscar ${artistName}:`, error);
        continue;
      }
    }

    return allTracks.length > 0 ? allTracks : createCompleteFallbackTracks();
  } catch (error) {
    console.error("🚨 Erro ao buscar músicas populares:", error);
    return createCompleteFallbackTracks();
  }
};

// ===== FUNÇÕES AUXILIARES =====

/**
 * Formata os dados do artista para o formato da aplicação
 * @param {Object} artist - Dados do artista da API
 * @returns {Array} Array com track formatada
 */
const formatArtistData = (artist) => {
  if (!artist) return [];

  const artistName = artist.strArtist || "Artista Desconhecido";
  const topTracks = ARTIST_TOP_TRACKS[artistName.toLowerCase()] || [
    "Hit Song",
    "Popular Track",
    "Fan Favorite",
    "Chart Topper",
    "Best Song",
  ];

  const randomTrack = topTracks[Math.floor(Math.random() * topTracks.length)];
  const duration = generateRandomDuration();
  const year = generateRandomYear(artist.intFormedYear);

  return [
    {
      id: `track_${artist.id || artistName.toLowerCase()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      nome: randomTrack,
      artista: artistName,
      genero: artist.strGenre || "Pop",
      ano: year,
      duracao: duration,
      album: `${randomTrack} - Single`,
      thumbnail: artist.strArtistThumb || getDefaultThumbnail(artistName),
      pais: artist.strCountry || "Não especificado",
      website: artist.strWebsite || "",
      biografia: artist.strBiographyEN || "",
    },
  ];
};

/**
 * Gera uma duração aleatória realista
 * @returns {string} Duração no formato "mm:ss"
 */
const generateRandomDuration = () => {
  const minutes = Math.floor(Math.random() * 2) + 2;
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * Gera um ano aleatório baseado no ano de formação
 * @param {string} formedYear - Ano de formação do artista
 * @returns {string} Ano como string
 */
const generateRandomYear = (formedYear) => {
  const startYear = parseInt(formedYear) || 2000;
  const currentYear = new Date().getFullYear();

  return startYear > currentYear
    ? currentYear.toString()
    : (
        Math.floor(Math.random() * (currentYear - startYear + 1)) + startYear
      ).toString();
};

/**
 * Cria artista fallback para quando a API falha
 * @param {string} query - Nome do artista
 * @returns {Object} Dados do artista fallback
 */
const createFallbackArtist = (query) => {
  const artistName = query.charAt(0).toUpperCase() + query.slice(1);
  return {
    id: `fallback_${query.toLowerCase()}`,
    strArtist: artistName,
    strGenre: "Pop",
    intFormedYear: "2000",
    strCountry: "EUA",
    strArtistThumb: getDefaultThumbnail(artistName),
    strWebsite: "",
    strBiographyEN: `${artistName} é um artista popular.`,
  };
};

/**
 * Cria tracks fallback completos
 * @returns {Array} Array de tracks fallback
 */
const createCompleteFallbackTracks = () => {
  return POPULAR_ARTISTS.slice(0, 10).flatMap((artistName) => {
    const formattedArtist = createFallbackArtist(artistName);
    return formatArtistData(formattedArtist);
  });
};

/**
 * Obtém thumbnail padrão para um artista
 * @param {string} artistName - Nome do artista
 * @returns {string} URL da thumbnail
 */
const getDefaultThumbnail = (artistName) => {
  const defaultThumbnails = {
    coldplay:
      "https://www.theaudiodb.com/images/media/artist/thumb/uxyqwy1347913127.jpg",
    "the weeknd":
      "https://www.theaudiodb.com/images/media/artist/thumb/uvstxx1347906113.jpg",
    "taylor swift":
      "https://www.theaudiodb.com/images/media/artist/thumb/tuyrvq1347723889.jpg",
    "ed sheeran":
      "https://www.theaudiodb.com/images/media/artist/thumb/vvwwus1347906499.jpg",
    "ariana grande":
      "https://www.theaudiodb.com/images/media/artist/thumb/wvwpsy1347724679.jpg",
    "bruno mars":
      "https://www.theaudiodb.com/images/media/artist/thumb/vwvprs1347724669.jpg",
    drake:
      "https://www.theaudiodb.com/images/media/artist/thumb/vvustw1347906379.jpg",
    "billie eilish":
      "https://www.theaudiodb.com/images/media/artist/thumb/yvupts1571655297.jpg",
    "maroon 5":
      "https://www.theaudiodb.com/images/media/artist/thumb/vvwpus1347906389.jpg",
    adele:
      "https://www.theaudiodb.com/images/media/artist/thumb/vvwpts1347906315.jpg",
    keane:
      "https://www.theaudiodb.com/images/media/artist/thumb/uwsyup1476958301.jpg",
  };

  return (
    defaultThumbnails[artistName.toLowerCase()] ||
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
  );
};

/**
 * Busca álbuns de um artista
 * @param {string} artistId - ID do artista
 * @returns {Promise<Array>} Array de álbuns
 */
export const getArtistAlbums = async (artistId) => {
  try {
    const response = await fetch(
      `${CORS_PROXY}/?${encodeURIComponent(
        `${API_BASE_URL}/album.php?i=${artistId}`
      )}`
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.album || [];
  } catch (error) {
    console.error("Erro ao buscar álbuns:", error);
    return [];
  }
};
