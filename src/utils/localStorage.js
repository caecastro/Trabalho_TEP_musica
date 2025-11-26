// src/utils/localStorage.js
export const saveToLocalStorage = (key, data) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Erro ao salvar no localStorage (${key}):`, error);
    return false;
  }
};

export const getFromLocalStorage = (key) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return null;
      }
      return JSON.parse(serializedData);
    }
    return null;
  } catch (error) {
    console.error(`Erro ao carregar do localStorage (${key}):`, error);
    return null;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(key);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Erro ao remover do localStorage (${key}):`, error);
    return false;
  }
};

export const clearLocalStorage = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.clear();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao limpar localStorage:", error);
    return false;
  }
};

// Utilitário para backup/restore
export const backupPlaylists = () => {
  const playlists = getFromLocalStorage("playlists");
  const currentPlaylist = getFromLocalStorage("currentPlaylist");

  return {
    playlists,
    currentPlaylist,
    backupDate: new Date().toISOString(),
  };
};

export const restorePlaylists = (backupData) => {
  if (backupData.playlists) {
    saveToLocalStorage("playlists", backupData.playlists);
  }
  if (backupData.currentPlaylist) {
    saveToLocalStorage("currentPlaylist", backupData.currentPlaylist);
  }
};
