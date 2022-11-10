import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../slices/users/userSlices"
import postReducer from "../slices/posts/postsSlice"
import commentReducer from "../slices/comments/CommentsSlice"


const store = configureStore({
    reducer: {
        users: userReducer,
        posts: postReducer,
        comments: commentReducer
    },
})

export default store