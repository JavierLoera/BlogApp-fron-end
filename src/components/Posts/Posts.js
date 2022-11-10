import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllPosts } from '../../redux/slices/posts/postsSlice'
import Post from './Post'

const Posts = () => {
    const dispatch = useDispatch()
    const state = useSelector(state => state?.posts)

    useEffect(() => {
        dispatch(fetchAllPosts())
    }, [dispatch])


    return (
        <div className='w-full h-fit mt-5 flex items-center flex-col'>
            {state?.posts?.length === 0 &&
                <div className='text-center w-full'>No se encontraron posts recientes</div>
            }
            {state?.posts?.map((post => {
                return (
                    <Post key={post._id}
                        id={post._id}
                        title={post.title}
                        image={post.image}
                        description={post.description}
                        user={{ firstName: post?.user.firstName, lastName: post?.user?.lastName }}
                        categories={post.category}
                        date={post.createdAt}
                        dislikes={post?.disLikes}
                        likes={post?.likes}
                        numViews={post.numViews}
                        numComments={post.comments?.length}
                    />
                )
            }))}
        </div>
    )
}

export default Posts