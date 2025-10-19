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

export const removeFromSessionStorage = (key) => {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Erro ao remover do sessionStorage:", error);
    return false;
  }
};

export const clearSessionStorage = () => {
  try {
    sessionStorage.clear();
    return true;
  } catch (error) {
    console.error("Erro ao limpar sessionStorage:", error);
    return false;
  }
};
