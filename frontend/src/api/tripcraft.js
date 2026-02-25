import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 60000,
})

export const generateItinerary = (destination, duration, interests) =>
  api.post('/generate', { destination, duration, interests })

export const fetchWeather = (destination) =>
  api.get('/weather', { params: { destination } })

export const fetchCityImage = (destination) =>
  api.get('/city-image', { params: { destination } })

export const sendItineraryEmail = (recipient, itinerary) =>
  api.post('/send-email', { recipient, itinerary })
