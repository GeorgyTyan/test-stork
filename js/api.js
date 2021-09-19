const api = {
  async fetchRequest(url) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      throw error;
    }
  }
};

export default api;