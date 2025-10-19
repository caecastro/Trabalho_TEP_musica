// src/services/audioDbService.js
const API_BASE_URL = "https://theaudiodb.com/api/v1/json/2";

const GENRE_ARTISTS = {
  rock: ["queen", "led zeppelin", "the beatles", "rolling stones"],
  pop: ["taylor swift", "ariana grande", "ed sheeran", "justin bieber"],
  jazz: ["miles davis", "louis armstrong", "ella fitzgerald", "john coltrane"],
  hiphop: ["eminem", "kendrick lamar", "drake", "kanye west"],
  electronic: ["daft punk", "chemical brothers", "aphex twin", "deadmau5"],
  classical: ["beethoven", "mozart", "bach", "chopin"],
};

// Cache de imagens funcionais
const WORKING_IMAGES = {
  queen:
    "https://www.theaudiodb.com/images/media/artist/thumb/vuxpxt1468302613.jpg",
  "the beatles":
    "https://www.theaudiodb.com/images/media/artist/thumb/rppvqy1347730062.jpg",
  "taylor swift":
    "https://www.theaudiodb.com/images/media/artist/thumb/tvrrrr1347731889.jpg",
  "ed sheeran":
    "https://www.theaudiodb.com/images/media/artist/thumb/xuyqpp1347731844.jpg",
  "ariana grande":
    "https://www.theaudiodb.com/images/media/artist/thumb/wurppt1347731849.jpg",
  drake:
    "https://www.theaudiodb.com/images/media/artist/thumb/uxvqpp1347731845.jpg",
  "the weeknd":
    "https://www.theaudiodb.com/images/media/artist/thumb/yvuspx1347731846.jpg",
  "billie eilish":
    "https://www.theaudiodb.com/images/media/artist/thumb/qyvspp1347731847.jpg",
  "bad bunny":
    "https://www.theaudiodb.com/images/media/artist/thumb/sputpp1347731848.jpg",
  "post malone":
    "https://www.theaudiodb.com/images/media/artist/thumb/rvrrry1347731850.jpg",
};

export const searchTracks = async (query) => {
  try {
    console.log("Buscando artista:", query);

    // Buscar artista
    const artistResponse = await fetch(
      `${API_BASE_URL}/search.php?s=${encodeURIComponent(query)}`
    );

    if (!artistResponse.ok) {
      throw new Error(`Erro HTTP: ${artistResponse.status}`);
    }

    const artistData = await artistResponse.json();
    console.log("Dados do artista retornados:", artistData);

    if (artistData.artists && artistData.artists.length > 0) {
      const artist = artistData.artists[0];
      console.log("Artista encontrado:", artist.strArtist);

      // Buscar álbuns do artista
      const albumResponse = await fetch(
        `${API_BASE_URL}/searchalbum.php?s=${encodeURIComponent(
          artist.strArtist
        )}`
      );

      if (!albumResponse.ok) {
        throw new Error(`Erro HTTP: ${albumResponse.status}`);
      }

      const albumData = await albumResponse.json();
      console.log(
        "Álbuns encontrados:",
        albumData.album ? albumData.album.length : 0
      );

      // Buscar músicas mais populares do artista
      const trackResponse = await fetch(
        `${API_BASE_URL}/track-top10.php?s=${encodeURIComponent(
          artist.strArtist
        )}`
      );

      let trackData = { track: [] };
      if (trackResponse.ok) {
        trackData = await trackResponse.json();
        console.log(
          "Músicas populares:",
          trackData.track ? trackData.track.length : 0
        );
      }

      return generateRealTracksFromArtist(artist, albumData, trackData);
    }

    console.log("Nenhum artista encontrado, usando mocks");
    return generateMockTracks(query);
  } catch (error) {
    console.error("Erro na busca de músicas:", error);
    return generateMockTracks(query);
  }
};

export const getPopularTracks = async () => {
  try {
    console.log("Buscando músicas populares...");

    const popularArtists = [
      "taylor swift",
      "the weeknd",
      "ed sheeran",
      "ariana grande",
      "drake",
      "billie eilish",
      "the beatles",
      "queen",
      "bad bunny",
      "post malone",
    ];

    const allTracks = [];
    const usedArtists = new Set();

    // Buscar de artistas reais
    for (const artist of popularArtists) {
      if (usedArtists.size >= 5) break; // Limitar a 5 artistas para performance

      try {
        const tracks = await searchTracks(artist);
        if (tracks.length > 0) {
          // Pegar até 2 músicas de cada artista
          const artistTracks = tracks.slice(0, 2);
          allTracks.push(...artistTracks);
          usedArtists.add(artist);
          console.log(
            `Adicionadas ${artistTracks.length} músicas de ${artist}`
          );
        }
        // Pequeno delay para não sobrecarregar a API
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Erro ao buscar ${artist}:`, error);
      }
    }

    // Se não conseguiu músicas reais, usar mocks
    if (allTracks.length === 0) {
      console.log("Usando músicas mockadas");
      return generateMockPopularTracks();
    }

    // Garantir que temos pelo menos 10 músicas
    if (allTracks.length < 10) {
      const remaining = 10 - allTracks.length;
      const mockTracks = generateMockPopularTracks().slice(0, remaining);
      allTracks.push(...mockTracks);
      console.log(`Adicionadas ${remaining} músicas mockadas`);
    }

    console.log(`Retornando ${allTracks.length} músicas no total`);
    return allTracks.slice(0, 10);
  } catch (error) {
    console.error("Erro ao buscar músicas populares:", error);
    return generateMockPopularTracks();
  }
};

const generateRealTracksFromArtist = (artist, albumData, trackData) => {
  const tracks = [];

  // Obter gênero do artista
  const genres = artist.strGenre
    ? artist.strGenre
        .split(",")
        .map((g) => g.trim())
        .slice(0, 1)
    : ["Pop"];

  // Obter thumbnail funcionando
  const thumbnail = getWorkingThumbnail(
    artist.strArtist,
    artist.strArtistThumb
  );

  console.log(`Gerando tracks para ${artist.strArtist}`, {
    genre: genres[0],
    thumbnail: thumbnail,
    albums: albumData.album ? albumData.album.length : 0,
    tracks: trackData.track ? trackData.track.length : 0,
  });

  // PRIMEIRO: Tentar usar as músicas reais da API
  if (trackData.track && trackData.track.length > 0) {
    trackData.track.forEach((track, index) => {
      if (index < 5) {
        // Limitar a 5 músicas reais
        tracks.push({
          id: `real_${artist.idArtist}_track_${track.idTrack}`,
          nome: track.strTrack || `${artist.strArtist} - Song ${index + 1}`,
          artista: artist.strArtist,
          genero: track.strGenre || genres[0] || "Pop",
          ano:
            track.intYearReleased ||
            track.strReleasedATE?.substring(0, 4) ||
            "2020",
          duracao: track.intDuration
            ? formatDuration(track.intDuration)
            : "3:30",
          album: track.strAlbum || `${artist.strArtist} Album`,
          thumbnail: thumbnail,
        });
      }
    });
  }

  // SEGUNDO: Se não tem músicas reais, criar baseado nos álbuns
  if (tracks.length === 0 && albumData.album && albumData.album.length > 0) {
    albumData.album.slice(0, 3).forEach((album, albumIndex) => {
      // Criar 2 músicas por álbum
      for (let i = 1; i <= 2; i++) {
        const trackName = getTrackName(album.strAlbum, i);
        const albumYear =
          album.intYearReleased || (2020 - albumIndex).toString();

        tracks.push({
          id: `real_${artist.idArtist}_${album.idAlbum}_${i}`,
          nome: trackName,
          artista: artist.strArtist,
          genero: genres[0] || "Pop",
          ano: albumYear,
          duracao: getRealisticDuration(),
          album: album.strAlbum || `${artist.strArtist} Album`,
          thumbnail: album.strAlbumThumb || thumbnail,
        });
      }
    });
  }

  // TERCEIRO: Se ainda não tem tracks, criar algumas genéricas
  if (tracks.length === 0) {
    for (let i = 1; i <= 3; i++) {
      tracks.push({
        id: `artist_${artist.idArtist}_${i}`,
        nome: `${artist.strArtist} - ${getHitSongName(i)}`,
        artista: artist.strArtist,
        genero: genres[0] || "Pop",
        ano: (2020 - i + 1).toString(),
        duracao: getRealisticDuration(),
        album: `${artist.strArtist} - Greatest Hits`,
        thumbnail: thumbnail,
      });
    }
  }

  console.log(`Geradas ${tracks.length} tracks para ${artist.strArtist}`);
  return tracks;
};

// Funções auxiliares melhoradas
const getWorkingThumbnail = (artistName, defaultThumbnail) => {
  const lowerName = artistName.toLowerCase();

  // Verificar se temos uma imagem funcionando no cache
  for (const [key, url] of Object.entries(WORKING_IMAGES)) {
    if (lowerName.includes(key.toLowerCase())) {
      console.log(`Usando thumbnail do cache para ${artistName}: ${url}`);
      return url;
    }
  }

  // Se a thumbnail padrão parece válida, usar
  if (
    defaultThumbnail &&
    defaultThumbnail.startsWith("http") &&
    !defaultThumbnail.includes("null")
  ) {
    console.log(
      `Usando thumbnail da API para ${artistName}: ${defaultThumbnail}`
    );
    return defaultThumbnail;
  }

  // Fallback para placeholder
  console.log(`Usando placeholder para ${artistName}`);
  return getDefaultThumbnail();
};

const formatDuration = (durationMs) => {
  if (!durationMs) return "3:30";

  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const getRealisticDuration = () => {
  const durations = ["2:45", "3:15", "3:30", "3:45", "4:10", "4:30"];
  return durations[Math.floor(Math.random() * durations.length)];
};

const getTrackName = (albumName, trackNumber) => {
  const songNames = [
    "Electric Dreams",
    "Midnight City",
    "Golden Hour",
    "Ocean Eyes",
    "Dancing Queen",
    "Firework",
    "Rolling in the Deep",
    "Happy",
    "Uptown Funk",
    "Shape of You",
    "Blinding Lights",
    "Levitating",
  ];

  const prefixes = ["", "Single: ", "Hit: "];
  const prefix = prefixes[trackNumber % prefixes.length];
  const songName =
    songNames[(trackNumber + albumName.length) % songNames.length];

  return `${prefix}${songName}`;
};

const getHitSongName = (number) => {
  const names = [
    "Global Hit",
    "Chart Topper",
    "Fan Favorite",
    "Radio Single",
    "Signature Song",
    "Breakthrough Hit",
    "Award Winner",
    "Summer Anthem",
  ];
  return names[number % names.length];
};

const generateMockTracks = (query) => {
  console.log("Gerando mocks para:", query);

  const tracks = [];

  const matchedGenre = Object.keys(GENRE_ARTISTS).find((genre) =>
    query.toLowerCase().includes(genre)
  );

  const artists = matchedGenre ? GENRE_ARTISTS[matchedGenre] : [query];

  artists.forEach((artist) => {
    for (let i = 1; i <= 3; i++) {
      tracks.push({
        id: `mock_${artist.replace(/\s+/g, "_")}_${i}`,
        nome: `${getHitSongName(i)}`,
        artista: artist,
        genero: matchedGenre || "Various",
        ano: (2018 + i).toString(),
        duracao: getRealisticDuration(),
        album: `${artist} - Official Album`,
        thumbnail: getWorkingThumbnail(artist, null),
      });
    }
  });

  return tracks;
};

const generateMockPopularTracks = () => {
  console.log("Gerando músicas populares mockadas");

  const popularTracks = [
    {
      id: "pop_1",
      nome: "Blinding Lights",
      artista: "The Weeknd",
      genero: "Pop",
      ano: "2019",
      duracao: "3:20",
      album: "After Hours",
      thumbnail: getWorkingThumbnail("the weeknd", null),
    },
    {
      id: "pop_2",
      nome: "Shape of You",
      artista: "Ed Sheeran",
      genero: "Pop",
      ano: "2017",
      duracao: "3:53",
      album: "÷",
      thumbnail: getWorkingThumbnail("ed sheeran", null),
    },
    {
      id: "pop_3",
      nome: "Bad Guy",
      artista: "Billie Eilish",
      genero: "Pop",
      ano: "2019",
      duracao: "3:14",
      album: "When We All Fall Asleep, Where Do We Go?",
      thumbnail: getWorkingThumbnail("billie eilish", null),
    },
    {
      id: "pop_4",
      nome: "Levitating",
      artista: "Dua Lipa",
      genero: "Pop",
      ano: "2020",
      duracao: "3:23",
      album: "Future Nostalgia",
      thumbnail:
        "https://www.theaudiodb.com/images/media/artist/thumb/qyvspp1347731847.jpg",
    },
    {
      id: "pop_5",
      nome: "Watermelon Sugar",
      artista: "Harry Styles",
      genero: "Pop",
      ano: "2019",
      duracao: "2:54",
      album: "Fine Line",
      thumbnail: getDefaultThumbnail(),
    },
  ];

  return popularTracks;
};

// Função para obter thumbnail padrão
const getDefaultThumbnail = () => {
  return "https://via.placeholder.com/300x300/4f46e5/ffffff?text=Music";
};
