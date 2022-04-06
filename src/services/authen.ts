import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_API || ''}/api/v1.0`
})

const signup = (payload: { email: string, password: string, confirmPassword: string }) => api.post('/authen/signup', payload)
const signin = (payload: { email: string, password: string }) => api.post('/authen/signin', payload)

export {
  signup,
  signin
}
