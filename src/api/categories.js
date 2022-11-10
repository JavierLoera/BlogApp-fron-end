import axios from 'axios'

const API = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL + '/api/category',
    headers: { 'Content-Type': 'application/json', }
})

API.interceptors.request.use((req) => {
    if (localStorage.getItem('userInfo')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}`
    }
    return req
})

export const fetchCategories = async () => {
    try {
        const response = await API.get('/')
        return response.data
    } catch (error) {
        return error
    }
}

export const createCategory = async (title) => {
    try {
        const response = await API.post('/', { title })
        return response.data
    } catch (error) {
        return error
    }
}

export const deleteCategory = async (id) => {
    try {
        const response = await API.delete(`/${id}`);
        return response.data
    } catch (error) {
        return error
    }
}

export const updateCategory = async (id, title) => {
    try {
        const response = await API.patch(`/${id}`, { title });
        return response.data
    } catch (error) {
        return error
    }
}