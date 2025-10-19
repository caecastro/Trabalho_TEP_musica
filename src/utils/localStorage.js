// src/utils/localStorage.js
export const saveToLocalStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    console.error("Erro ao salvar no localStorage:", error);
    return false;
  }
};

export const getFromLocalStorage = (key) => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error("Erro ao recuperar do localStorage:", error);
    return null;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Erro ao remover do localStorage:", error);
    return false;
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Erro ao limpar localStorage:", error);
    return false;
  }
};

// Funções para sessionStorage
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

export const getFromSessionStorage = (key) => {
  try {
    const serializedData = sessionStorage.getItem(key);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error("Erro ao recuperar do sessionStorage:", error);
    return null;
  }
};
