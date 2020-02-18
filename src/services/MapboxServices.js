import axios from 'axios'

const https = axios.create({
  baseURL: 'https://api.mapbox.com'
})

const accessToken = `access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`

const searchLocation = (place) => https.get(`/geocoding/v5/mapbox.places/${place}.json?${accessToken}`)
const directions = (coordinates) => https.get(`/directions/v5/mapbox/driving/${coordinates}?${accessToken}`)

export default {
  searchLocation,
  directions
}
