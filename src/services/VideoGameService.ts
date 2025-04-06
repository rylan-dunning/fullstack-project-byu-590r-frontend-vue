import API_URL from './env'
import axios from 'axios'

export default {
  getVideoGames() {
    // Get token from the user object
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const token = user.token
    console.log('Token from user object:', token)
    
    const headers = token 
      ? { Authorization: `Bearer ${token}` }
      : {}
    
    return axios.get(`${API_URL}video-games`, { headers })
  },

  createVideoGame(gameData) {
    // Get token from the user object
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const token = user.token
    
    if (!token) {
      return Promise.reject(new Error('Authentication required'))
    }
    
    return axios.post(`${API_URL}video-games`, gameData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  getVideoGame(id) {
    // Get token from the user object
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const token = user.token
    
    if (!token) {
      return Promise.reject(new Error('Authentication required'))
    }
    
    return axios.get(`${API_URL}video-games/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  updateVideoGame(id, gameData) {
    // Get token from the user object
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const token = user.token
    
    if (!token) {
      return Promise.reject(new Error('Authentication required'))
    }
    
    return axios.post(`${API_URL}video-games/${id}?_method=PUT`, gameData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  deleteVideoGame(id) {
    // Get token from the user object
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const token = user.token
    
    if (!token) {
      return Promise.reject(new Error('Authentication required'))
    }
    
    return axios.delete(`${API_URL}video-games/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },
}