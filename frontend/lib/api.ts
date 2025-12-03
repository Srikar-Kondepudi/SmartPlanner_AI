import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors - but don't auto-redirect (let components handle it)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
    }
    return Promise.reject(error)
  }
)

export default api

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; full_name?: string }) =>
    api.post('/auth/register', data),
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', new URLSearchParams(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
  getMe: () => api.get('/auth/me'),
}

// Projects API
export const projectsAPI = {
  list: () => api.get('/projects'),
  get: (id: number) => api.get(`/projects/${id}`),
  create: (data: { name: string; description?: string }) =>
    api.post('/projects', data),
  uploadSpec: (id: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/projects/${id}/upload-spec`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  generateSprintPlan: (id: number, llm_provider: string = 'ollama') =>
    api.post(`/projects/${id}/generate-sprint-plan?llm_provider=${llm_provider}`),
  getEpics: (id: number) => api.get(`/projects/${id}/epics`),
  getStories: (id: number, epic_id?: number) =>
    api.get(`/projects/${id}/stories${epic_id ? `?epic_id=${epic_id}` : ''}`),
  getTasks: (id: number, story_id?: number) =>
    api.get(`/projects/${id}/tasks${story_id ? `?story_id=${story_id}` : ''}`),
  exportPDF: (id: number) =>
    api.get(`/projects/${id}/export/pdf`, { responseType: 'blob' }),
  exportCSV: (id: number) =>
    api.get(`/projects/${id}/export/csv`, { responseType: 'blob' }),
  exportJIRA: (id: number) =>
    api.get(`/projects/${id}/export/jira`, { responseType: 'blob' }),
}

// Sprints API
export const sprintsAPI = {
  list: (project_id: number) => api.get(`/sprints/project/${project_id}`),
  get: (id: number) => api.get(`/sprints/${id}`),
  create: (project_id: number, data: {
    name: string
    task_ids: number[]
    start_date?: string
    end_date?: string
  }) => api.post(`/sprints?project_id=${project_id}`, data),
}

