import API_URL from './env'
import authHeader from './auth-header'
import axios from 'axios';

export default {
    getVideoGames() {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Debugging to check if token exists
        
        return axios.get(`${API_URL}video-games`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      },
  
  createVideoGame(gameData) {
    return axios.post(`${API_URL}video-games`, gameData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  getVideoGame(id) {
    return axios.get(`${API_URL}video-games/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },
  
  updateVideoGame(id, gameData) {
    return axios.put(`${API_URL}video-games/${id}`, gameData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  deleteVideoGame(id) {
    return axios.delete(`${API_URL}video-games/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
};