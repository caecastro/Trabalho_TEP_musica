// src/utils/localStorage.js

// ===== LOCALSTORAGE =====

/**
 * Salva dados no localStorage
 * @param {string} key - Chave para armazenamento
 * @param {any} data - Dados a serem salvos
 * @returns {boolean} Sucesso da operação
 */
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

/**
 * Carrega dados do localStorage
 * @param {string} key - Chave dos dados
 * @returns {any} Dados carregados ou null
 */
export const getFromLocalStorage = (key) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const serializedData = localStorage.getItem(key);
      return serializedData ? JSON.parse(serializedData) : null;
    }
    return null;
  } catch (error) {
    console.error(`Erro ao carregar do localStorage (${key}):`, error);
    return null;
  }
};

/**
 * Remove dados do localStorage
 * @param {string} key - Chave a ser removida
 * @returns {boolean} Sucesso da operação
 */
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

/**
 * Limpa todo o localStorage
 * @returns {boolean} Sucesso da operação
 */
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

// ===== SESSIONSTORAGE =====

/**
 * Salva dados no sessionStorage
 * @param {string} key - Chave para armazenamento
 * @param {any} data - Dados a serem salvos
 * @returns {boolean} Sucesso da operação
 */
export const saveToSessionStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    sessionStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    console.error("Erro ao salvar no sessionStorage:", error);
    return false;
  }
};

/**
 * Carrega dados do sessionStorage
 * @param {string} key - Chave dos dados
 * @returns {any} Dados carregados ou null
 */
export const getFromSessionStorage = (key) => {
  try {
    const serializedData = sessionStorage.getItem(key);
    return serializedData ? JSON.parse(serializedData) : null;
  } catch (error) {
    console.error("Erro ao recuperar do sessionStorage:", error);
    return null;
  }
};

/**
 * Remove dados do sessionStorage
 * @param {string} key - Chave a ser removida
 * @returns {boolean} Sucesso da operação
 */
export const removeFromSessionStorage = (key) => {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Erro ao remover do sessionStorage:", error);
    return false;
  }
};

/**
 * Limpa todo o sessionStorage
 * @returns {boolean} Sucesso da operação
 */
export const clearSessionStorage = () => {
  try {
    sessionStorage.clear();
    return true;
  } catch (error) {
    console.error("Erro ao limpar sessionStorage:", error);
    return false;
  }
};

// ===== BACKUP/RESTORE =====

/**
 * Cria backup das playlists
 * @returns {Object} Dados de backup
 */
export const backupPlaylists = () => {
  const playlists = getFromLocalStorage("playlists");
  const currentPlaylist = getFromLocalStorage("currentPlaylist");

  return {
    playlists,
    currentPlaylist,
    backupDate: new Date().toISOString(),
  };
};

/**
 * Restaura playlists do backup
 * @param {Object} backupData - Dados de backup
 */
export const restorePlaylists = (backupData) => {
  if (backupData.playlists) {
    saveToLocalStorage("playlists", backupData.playlists);
  }
  if (backupData.currentPlaylist) {
    saveToLocalStorage("currentPlaylist", backupData.currentPlaylist);
  }
};
