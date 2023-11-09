import { axiosInstance } from "@lib/axios"

export const authService = {
    async login(username, password) {
        return await axiosInstance.post('/login', {
            username,
            password
        })
    },
    async changePassword(oldPassword, newPassword) {
        return await axiosInstance.post('/change-password', {
            oldPassword,
            newPassword
        })

    }
}