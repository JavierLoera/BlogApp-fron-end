import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";
import { deleteCommentPostDetails, fetchpostDetails, updateCommentPostDetails } from "../posts/postsSlice";

const API = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL + '/api/comments',
    headers: { 'Content-Type': 'application/json', }
})

API.interceptors.request.use((req) => {
    if (localStorage.getItem('userInfo')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}`
    }
    return req
})


export const createComment = createAsyncThunk('createComment', async (dataToSend, { rejectWithValue, dispatch }) => {
    try {
        const { data } = await API.post('/', dataToSend);
        dispatch(fetchpostDetails(dataToSend.postId))
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})

export const deleteComment = createAsyncThunk('deleteComment', async (id, { rejectWithValue, dispatch }) => {
    try {
        const { data } = await API.delete(`/${id}`);
        dispatch(deleteCommentPostDetails(data._id))
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})

export const updateComment = createAsyncThunk('update/comment', async (dataToSend, { rejectWithValue, dispatch }) => {
    try {
        const { data } = await API.patch(`/${dataToSend.commentId}`, dataToSend);
        dispatch(updateCommentPostDetails({ id: dataToSend.commentId, data }))
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})
const commentSlice = createSlice({
    name: 'comments',
    initialState: {},
    extraReducers: {

    }
})

export default commentSlice.reducer