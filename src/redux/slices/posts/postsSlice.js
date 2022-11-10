import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchUserDetails } from "../users/userSlices";

const API = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL + '/api/posts',
    headers: {
        'Content-Type': 'application/json',
    }
})

API.interceptors.request.use((req) => {
    if (localStorage.getItem('userInfo')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}`
    }
    return req
})

export const createPost = createAsyncThunk('create/post', async (formData, { getState, rejectWithValue, dispatch }) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}`
        }
    }
    const url = process.env.REACT_APP_BACKEND_URL + '/api/posts/'
    const user = getState();
    try {
        const { data } = await axios.post(url, formData, config)
        dispatch(fetchUserDetails(user.users.userAuth._id));
        localStorage.setItem('postId', data._id)
        return data
    } catch (error) {
        if (!error.data) throw Error
        return rejectWithValue(error?.response?.data)
    }
})

export const fetchAllPosts = createAsyncThunk('fetch/posts', async (a, { rejectWithValue }) => {
    try {
        const { data } = await API.get()
        return data
    } catch (error) {
        if (!error?.response) throw Error
        console.log(error)
        return rejectWithValue(error?.response?.data)
    }

})

export const fetchpostDetails = createAsyncThunk('post/details', async (id, { rejectWithValue }) => {
    try {
        const { data } = await API.get(`/${id}`);
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})

export const likePost = createAsyncThunk('like/post', async (id, { rejectWithValue, getState, dispatch }) => {
    try {
        const { data } = await API.patch('/like', { postId: id });
        dispatch(fetchUserDetails(getState().users.userAuth?._id))
        return data
    } catch (error) {
        if (!error?.response) throw Error;
        return rejectWithValue(error?.response?.data)
    }
})

export const disLikePost = createAsyncThunk('disLike/post', async (id, { rejectWithValue, dispatch, getState }) => {
    try {
        const { data } = await API.patch('/dislike', { postId: id });
        dispatch(fetchUserDetails(getState().users.userAuth?._id))
        return data
    } catch (error) {
        if (!error?.response) throw Error;
        return rejectWithValue(error?.response?.data)
    }
})

export const deletePost = createAsyncThunk('deletePost', async (id, { rejectWithValue, dispatch, getState }) => {
    try {
        const { data } = await API.delete(`/${id}`)
        dispatch(fetchUserDetails(getState().users.userAuth?._id))
        return data
    } catch (error) {
        if (!error?.response) throw Error;
        return rejectWithValue(error?.response?.data)
    }
})

export const updatePost = createAsyncThunk('update/Post', async (dataToSend, { rejectWithValue }) => {
    try {
        console.log(dataToSend)
        const { data } = await API.patch(`/${dataToSend.id}`, dataToSend.values)
        console.log(data)
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})

const postsSlices = createSlice({
    name: "posts",
    initialState: {},
    reducers: {
        deleteCommentPostDetails: (state, action) => {
            const indexComment = state.postDetails.comments.findIndex((elem) => elem._id === action.payload._id)
            state.postDetails.comments.splice(indexComment, 1)
        },
        updateCommentPostDetails: (state, action) => {
            const indexComment = state.postDetails.comments.findIndex((elem) => elem._id === action.payload.id);
            state.postDetails.comments.splice(indexComment, 1, action.payload.data)
        }
    },
    extraReducers: {
        [createPost.fulfilled]: (state, action) => {
            state.loading = false;
            state.postError = undefined;
            state.serverErr = undefined;
        },
        [createPost.pending]: (state, action) => {
            state.loading = true;
            state.postError = undefined;
            state.serverErr = undefined;
        },
        [createPost.rejected]: (state, action) => {
            state.loading = false;
            state.postError = action?.payload?.message;
            state.serverErr = action?.error?.message;
        },
        [fetchAllPosts.fulfilled]: (state, action) => {
            state.posts = action.payload
            state.loading = false;
            state.serverErr = undefined
        },
        [fetchAllPosts.pending]: (state, action) => {
            state.loading = true
            state.serverErr = undefined
        },
        [fetchAllPosts.rejected]: (state, action) => {
            state.serverErr = action?.error?.message;
            state.loading = false
        },
        [fetchpostDetails.fulfilled]: (state, action) => {
            state.postDetails = action.payload
            state.loading = false
        },
        [fetchpostDetails.pending]: (state, action) => {
            state.loading = true
            state.serverErr = undefined
        },
        [fetchpostDetails.rejected]: (state, action) => {
            state.serverErr = action?.error?.message;
            state.loading = false
        },
        [likePost.fulfilled]: (state, action) => {
            const post = state?.posts?.findIndex(post => post._id === action.payload._id)
            state.posts?.splice(post, 1, action.payload)
            state.postDetails = action?.payload
        },
        [disLikePost.fulfilled]: (state, action) => {
            const post = state?.posts?.findIndex(post => post._id === action.payload._id)
            state.posts?.splice(post, 1, action.payload)
            state.postDetails = action?.payload
        },



    }
})

export default postsSlices.reducer
export const { deleteCommentPostDetails, updateCommentPostDetails } = postsSlices.actions
