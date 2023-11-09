import axios from 'axios'
import { toast } from 'react-toastify'

const axiosInstance = axios.create({
    baseURL: '/api',
})

axiosInstance.interceptors.request.use(
    options => {
        let accessToken
        if (typeof window !== "undefined") {
            accessToken = localStorage.getItem("accessToken") || ""
        }
        if (accessToken) {
            options.headers.Authorization = `Bearer ${accessToken}`
        }
        return options
    },
    error => Promise.reject(error)
)

axiosInstance.interceptors.response.use(({ data }) => data,  async error => {
    if (error?.response?.status === 401) {
        if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken") 
            window.location.href = '/admin'
            toast.info('Phiên đăng nhập đã hết hạn!')
            
        }
    }
    return Promise.reject(error)
})

export { axiosInstance } 