import VideoGameService from '../services/VideoGameService';

const state = {
  videoGames: [],
  videoGame: {
    title: '',
    file: '',
    description: '',
    year: ''
  },
  loading: false,
  error: null
};

const getters = {
  getAllVideoGames: state => state.videoGames,
  getVideoGame: state => state.videoGame,
  isLoading: state => state.loading,
  hasError: state => state.error
};

const actions = {
  async getVideoGames({ commit }) {
    commit('setLoading', true);
    try {
      const response = await VideoGameService.getVideoGames();
      commit('setVideoGames', response.data.data);
      commit('setError', null);
    } catch (error) {
      commit('setError', error.response?.data?.message || 'Failed to fetch video games');
    } finally {
      commit('setLoading', false);
    }
  },
  
  async createVideoGame({ commit }, gameData) {
    commit('setLoading', true);
    try {
      const response = await VideoGameService.createVideoGame(gameData);
      commit('addVideoGame', response.data.data);
      commit('setError', null);
      return response.data;
    } catch (error) {
      commit('setError', error.response?.data?.message || 'Failed to create video game');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async getVideoGame({ commit }, id) {
    commit('setLoading', true);
    try {
      const response = await VideoGameService.getVideoGame(id);
      commit('setVideoGame', response.data.data);
      commit('setError', null);
    } catch (error) {
      commit('setError', error.response?.data?.message || 'Failed to fetch video game');
    } finally {
      commit('setLoading', false);
    }
  },
  
  async updateVideoGame({ commit }, { id, gameData }) {
    commit('setLoading', true);
    try {
      const response = await VideoGameService.updateVideoGame(id, gameData);
      commit('updateVideoGame', response.data.data);
      commit('setError', null);
      return response.data;
    } catch (error) {
      commit('setError', error.response?.data?.message || 'Failed to update video game');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  
  async deleteVideoGame({ commit }, id) {
    commit('setLoading', true);
    try {
      await VideoGameService.deleteVideoGame(id);
      commit('removeVideoGame', id);
      commit('setError', null);
    } catch (error) {
      commit('setError', error.response?.data?.message || 'Failed to delete video game');
    } finally {
      commit('setLoading', false);
    }
  }
};

const mutations = {
  setVideoGames(state, videoGames) {
    state.videoGames = videoGames;
  },
  
  setVideoGame(state, videoGame) {
    state.videoGame = videoGame;
  },
  
  addVideoGame(state, videoGame) {
    state.videoGames.push(videoGame);
  },
  
  updateVideoGame(state, updatedGame) {
    const index = state.videoGames.findIndex(game => game.id === updatedGame.id);
    if (index !== -1) {
      state.videoGames.splice(index, 1, updatedGame);
    }
  },
  
  removeVideoGame(state, id) {
    state.videoGames = state.videoGames.filter(game => game.id !== id);
  },
  
  setLoading(state, status) {
    state.loading = status;
  },
  
  setError(state, error) {
    state.error = error;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};