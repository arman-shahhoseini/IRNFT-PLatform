import { API_ENDPOINTS } from './constants'
import { handleError } from './error'

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000'

const getHeaders = () => {
  const token = localStorage.getItem('auth_token')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json()
    throw handleError(error)
  }
  return response.json()
}

export const api = {
  // Auth APIs
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(credentials)
      })
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData)
      })
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {
        method: 'POST',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  },

  // User APIs
  getUserProfile: async () => {
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.USER.PROFILE}`, {
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  },

  updateUserProfile: async (profileData) => {
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.USER.UPDATE}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(profileData)
      })
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  },

  // NFT APIs
  getNFTs: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString()
      const response = await fetch(`${API_URL}${API_ENDPOINTS.NFT.LIST}?${queryString}`, {
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  },

  createNFT: async (nftData) => {
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.NFT.CREATE}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(nftData)
      })
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  },

  updateNFT: async (nftId, nftData) => {
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.NFT.UPDATE}/${nftId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(nftData)
      })
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  },

  deleteNFT: async (nftId) => {
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.NFT.DELETE}/${nftId}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  },

  // Marketplace APIs
  getMarketplaceItems: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString()
      const response = await fetch(`${API_URL}${API_ENDPOINTS.MARKETPLACE.LIST}?${queryString}`, {
        headers: getHeaders()
      })
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  },

  buyNFT: async (nftId, transactionData) => {
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.MARKETPLACE.BUY}/${nftId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(transactionData)
      })
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  },

  sellNFT: async (nftId, price) => {
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.MARKETPLACE.SELL}/${nftId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ price })
      })
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  },

  // Upload APIs
  uploadImage: async (file) => {
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      })
      return handleResponse(response)
    } catch (error) {
      throw handleError(error)
    }
  }
} 