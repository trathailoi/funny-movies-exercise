import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_API || ''}${import.meta.env.VITE_BASE_API_VERSION || '/api/v1.0'}`,
  withCredentials: true
})

const getMovies = (params?: { pageSize?: number, currentPage?: number }) => api.get('/movies', { params })
const reactOnMovie = (params: { movieId: string, action: string }) => api.patch(`/movies/${params.movieId}/reactions`, { params: { action: params.action } })

export {
  getMovies,
  reactOnMovie
}
