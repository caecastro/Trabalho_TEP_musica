// src/utils/sessionStorage.js

/**
 * Gerencia operações no sessionStorage com tratamento de erro
 * Dados são perdidos ao fechar a aba/navegador
 */

/**
 * Salva dados no sessionStorage
 * @param {string} key - Chave para identificação
 * @param {any} data - Dados a serem salvos (serão convertidos para JSON)
 * @returns {boolean} True se salvou com sucesso, false em caso de erro
 */
export const saveToSessionStorage = (key, data) => {
  try {
    // Verificar se sessionStorage está disponível
    if (typeof sessionStorage === "undefined") {
      console.warn("sessionStorage não disponível neste ambiente");
      return false;
    }

    const serializedData = JSON.stringify(data);
    sessionStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    console.error(`Erro ao salvar no sessionStorage (chave: ${key}):`, error);
    return false;
  }
};

/**
 * Recupera dados do sessionStorage
 * @param {string} key - Chave dos dados buscados
 * @returns {any|null} Dados recuperados ou null se não existir/erro
 */
export const getFromSessionStorage = (key) => {
  try {
    if (typeof sessionStorage === "undefined") {
      console.warn("sessionStorage não disponível neste ambiente");
      return null;
    }

    const serializedData = sessionStorage.getItem(key);

    // Retornar null se a chave não existir
    if (serializedData === null) {
      return null;
    }

    return JSON.parse(serializedData);
  } catch (error) {
    console.error(
      `Erro ao recuperar do sessionStorage (chave: ${key}):`,
      error
    );
    return null;
  }
};

/**
 * Remove um item específico do sessionStorage
 * @param {string} key - Chave do item a ser removido
 * @returns {boolean} True se removeu com sucesso, false em caso de erro
 */
export const removeFromSessionStorage = (key) => {
  try {
    if (typeof sessionStorage === "undefined") {
      console.warn("sessionStorage não disponível neste ambiente");
      return false;
    }

    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Erro ao remover do sessionStorage (chave: ${key}):`, error);
    return false;
  }
};

/**
 * Limpa todo o sessionStorage
 * @returns {boolean} True se limpou com sucesso, false em caso de erro
 */
export const clearSessionStorage = () => {
  try {
    if (typeof sessionStorage === "undefined") {
      console.warn("sessionStorage não disponível neste ambiente");
      return false;
    }

    sessionStorage.clear();
    return true;
  } catch (error) {
    console.error("Erro ao limpar sessionStorage:", error);
    return false;
  }
};

/**
 * Verifica se uma chave existe no sessionStorage
 * @param {string} key - Chave a ser verificada
 * @returns {boolean} True se a chave existe
 */
export const existsInSessionStorage = (key) => {
  try {
    if (typeof sessionStorage === "undefined") return false;
    return sessionStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Erro ao verificar chave no sessionStorage (${key}):`, error);
    return false;
  }
};

/**
 * Obtém todas as chaves armazenadas no sessionStorage
 * @returns {string[]} Array com todas as chaves
 */
export const getAllSessionStorageKeys = () => {
  try {
    if (typeof sessionStorage === "undefined") return [];
    return Object.keys(sessionStorage);
  } catch (error) {
    console.error("Erro ao obter chaves do sessionStorage:", error);
    return [];
  }
};
