import { axiosInstance } from "@lib/axios"
export const postService = {
    async addNew(content) {
        return await axiosInstance.post('/post', { content })
    },
    async getAll() {
        return await axiosInstance.get('/post')
    },
    async getOne(slug) {
        return await axiosInstance.get(`/post/${slug}`)
    },
    async delete(slug) {
        return await axiosInstance.delete(`/post/${slug}`)
    },
    async update(slug, content) {
        return await axiosInstance.put(`/post/${slug}`, { content })
    },
}