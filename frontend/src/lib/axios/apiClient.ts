import axios from 'axios'
import { API_URL } from '@/config/constants'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})
