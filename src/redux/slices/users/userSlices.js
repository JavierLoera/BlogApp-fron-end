import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const API = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL + '/api/user', headers: {
        'Content-Type': 'application/json',
    }
});

API.interceptors.request.use((req) => {
    if (localStorage.getItem('userInfo')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}`
    }
    return req
})

export const registerUserAction = createAsyncThunk('register', async (user, { rejectWithValue, getState, dispatch }) => {
    try {
        const { data } = await API.post('/register', user);
        return data
    } catch (error) {
        if (!error?.response) {
            throw Error
        }
        return rejectWithValue(error?.response?.data)
    }
})

export const loginUserAction = createAsyncThunk('login', async (user, { rejectWithValue, dispatch }) => {
    try {
        const { data } = await API.post('/login', user);
        localStorage.setItem('userInfo', JSON.stringify(data))
        dispatch(userAuthData())
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})

export const userAuthData = createAsyncThunk('user/auth', async (id, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/user-auth');
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})

export const fetchUsers = createAsyncThunk('fetch/users', async (U, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/')
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})

export const deleteUser = createAsyncThunk('delete/user', async (id, { rejectWithValue }) => {
    try {
        const { data } = await API.delete(`/${id}`)
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})

export const fetchUserDetails = createAsyncThunk('fetch/details', async (id, { rejectWithValue }) => {
    try {
        const { data } = await API.get(`/profile/${id}`);
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})

export const updateUser = createAsyncThunk('update/user', async ({ id, values }, { rejectWithValue, dispatch }) => {
    try {
        const { data } = await API.put(`/${id}`, { firstName: values?.firstName, lastName: values?.lastName, bio: values?.bio });
        dispatch(userAuthData())
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})

export const forgetPassword = createAsyncThunk('forget/password', async (email, { rejectWithValue }) => {
    try {
        const { data } = await API.post('/forget-password-token', email)
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})

export const resetPassword = createAsyncThunk('reset/password', async ({ password, token }, { rejectWithValue }) => {
    try {
        const { data } = await API.post(`/reset-password/${token}`, { token, password })
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})

export const changePassword = createAsyncThunk('change/password', async (password, { rejectWithValue }) => {
    try {
        const { data } = await API.patch(`/password/`, { password });
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})

export const toggleFollowUser = createAsyncThunk('toggle/follow', async (id, { dispatch, getState, rejectWithValue }) => {
    try {
        const { data } = await API.patch('/follow', { id });
        dispatch(fetchUserDetails(id))
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})

export const blockUser = createAsyncThunk('block/user', async (id, { rejectWithValue }) => {
    try {
        const { data } = await API.patch(`/block-user/${id}`);
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})

export const generateTokenVerification = createAsyncThunk('generate/token', async (a, { rejectWithValue }) => {
    try {
        const { data } = await API.post('/generate-verify-email-token');
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})

export const verifyToken = createAsyncThunk('verfiy/token', async (token, { rejectWithValue, dispatch }) => {
    try {
        const { data } = await API.patch(`/verify-account/${token}`);
        dispatch(userAuthData())
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})

export const uploadImage = createAsyncThunk('upload/image', async (formData, { rejectWithValue, dispatch }) => {
    const config = {
        headers: {
            // "Content-type": "multipart/form-data",
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}`
        }
    }
    const url = 'http://localhost:4000/api/user/profilephoto-upload'
    //no funciono con la config de API y el header no lleva el multipart/form-data.
    try {
        const { data } = await axios.patch(url, formData, config)
        dispatch(userAuthData())
        return data
    } catch (error) {
        if (!error?.response) throw Error
        return rejectWithValue(error?.response?.data)
    }
})


const usersSlices = createSlice({
    name: "users",
    initialState: {
        userAuth: '',
        authors: undefined,
        registered: undefined,
        userDetails: undefined,
        messageForgetPassword: undefined,
        changedPasswordResponse: undefined
    },
    reducers: {
        logout: (state, action) => {
            localStorage.clear();
            state.userAuth = ''
        },
        clearMessageResetPassword: (state, action) => {
            state.messageForgetPassword = undefined
        },
        clearMessageChangePassword: (state, action) => {
            state.isPasswordUpdated = false
        }
    },
    extraReducers: {
        [registerUserAction.fulfilled]: (state, action) => {
            state.loading = false;
            state.registered = action?.payload;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [registerUserAction.pending]: (state, action) => {
            state.loading = true;
            state.appErr = undefined;
            state.serverErr = undefined;

        },
        [registerUserAction.rejected]: (state, action) => {
            state.loading = false;
            state.appErr = action?.payload?.message;
            state.serverErr = action?.error?.message;
        },
        //login
        [loginUserAction.fulfilled]: (state, action) => {
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [loginUserAction.pending]: (state, action) => {
            state.loading = true;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [loginUserAction.rejected]: (state, action) => {
            state.loading = false;
            state.appErr = action?.payload?.message
            state.serverErr = action?.error?.message;
        },
        //userAuthData
        [userAuthData.fulfilled]: (state, action) => {
            state.userAuth = action?.payload
        },

        ///fetch authors
        [fetchUsers.fulfilled]: (state, action) => {
            state.authors = action?.payload
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [fetchUsers.pending]: (state, action) => {
            state.loading = true;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [fetchUsers.rejected]: (state, action) => {
            state.loading = false;
            state.appErr = action?.payload?.message
            state.serverErr = action?.error?.message;
        },
        //deleteUser
        [deleteUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [deleteUser.pending]: (state, action) => {
            state.loading = true;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [deleteUser.rejected]: (state, action) => {
            state.loading = false;
            state.appErr = action?.payload?.message
            state.serverErr = action?.error?.message;
        },
        //user Details
        [fetchUserDetails.fulfilled]: (state, action) => {
            state.userDetails = action.payload;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [fetchUserDetails.pending]: (state, action) => {
            state.loading = true;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [fetchUserDetails.rejected]: (state, action) => {
            state.loading = false;
            state.appErr = action?.payload?.message
            state.serverErr = action?.error?.message;
        },
        //update User
        [updateUser.fulfilled]: (state, action) => {
            state.userAuth = action.payload;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [updateUser.pending]: (state, action) => {
            state.loading = true;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [updateUser.rejected]: (state, action) => {
            state.loading = false;
            state.appErr = action?.payload?.message
            state.serverErr = action?.error?.message;
        },
        //forget passwrord send email
        [forgetPassword.fulfilled]: (state, action) => {
            state.messageForgetPassword = action.payload.message;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [forgetPassword.pending]: (state, action) => {
            state.loading = true;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [forgetPassword.rejected]: (state, action) => {
            state.loading = false;
            state.appErr = action?.payload?.message
            state.serverErr = action?.error?.message;
        },
        //reset password
        [resetPassword.fulfilled]: (state, action) => {
            state.messageForgetPassword = action.payload.message;
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [resetPassword.pending]: (state, action) => {
            state.loading = true;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [resetPassword.rejected]: (state, action) => {
            state.loading = false;
            state.appErr = action?.payload?.message
            state.serverErr = action?.error?.message;
        },
        //change password userAuth
        [changePassword.fulfilled]: (state, action) => {
            state.loading = false;
            state.isPasswordUpdated = true;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [changePassword.pending]: (state, action) => {
            state.loading = true;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [changePassword.rejected]: (state, action) => {
            state.loading = false;
            state.appErr = action?.payload?.message
            state.serverErr = action?.error?.message;
        },
        //toggle follow unfollow
        [toggleFollowUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [toggleFollowUser.pending]: (state, action) => {
            state.loading = true;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [toggleFollowUser.rejected]: (state, action) => {
            state.loading = false;
            state.appErr = action?.payload?.message
            state.serverErr = action?.error?.message;
        },
        [blockUser.fulfilled]: (state, action) => {
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [blockUser.pending]: (state, action) => {
            state.loading = true;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
        [blockUser.rejected]: (state, action) => {
            state.loading = false;
            state.appErr = action?.payload?.message
            state.serverErr = action?.error?.message;
        },
        [verifyToken.fulfilled]: (state, action) => {
            state.userAuth.isAccountVerified = action.payload.isAccountVerified
            state.loading = false;
            state.appErr = undefined;
            state.serverErr = undefined;
        },
    }
})

export const { logout, clearMessageResetPassword, clearMessageChangePassword } = usersSlices.actions
export default usersSlices.reducer 