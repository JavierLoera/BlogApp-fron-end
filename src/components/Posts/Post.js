import { Card } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { deletePost, disLikePost, likePost } from '../../redux/slices/posts/postsSlice';


const Post = ({ id, title, image, description, user, categories, date, dislikes, likes, numViews, postUser, numComments }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const usersState = useSelector(state => state?.users)
    const { userAuth } = usersState

    let isLikedThisPost = likes?.find((id) => id === userAuth?._id)
    let isDislikedThisPost = dislikes?.find((id) => id === userAuth?._id)

    const handleLikeClick = () => {
        if (!userAuth) return navigate('/login')
        dispatch(likePost(id));
    }

    const handleClickDislike = () => {
        if (!userAuth) return navigate('/login')
        dispatch(disLikePost(id))
    }

    const dateFormated = new Date(date);
    return (
        <div className="max-w-sm lg:max-w-md mt-3 border-b-4 rounded-lg border-gray-200">
            <div className='w-full h-10 bg-slate-100 p-2 rounded-lg'>
                <span>{user?.firstName + " " + user?.lastName}</span>
                <span className='float-right'>{dateFormated.toLocaleDateString()}</span>
            </div>

            <Card imgSrc={image}>
                {(user?.userAuthId !== undefined && postUser) && user?.userAuthId === postUser ?
                    (<div className='w-full h-3'>
                        <i onClick={() => dispatch(deletePost(id))} className="m-2 float-right fa-solid fa-trash"></i>
                    </div>) : null}
                <Link to={`/post/details/${id}`}>
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {title}
                    </h5>
                </Link>

                <p className="font-normal text-gray-700 dark:text-gray-400">
                    {description.slice(0, 100)}
                    {description.length > 100 ? "..." : null}
                </p>
                {categories.map(category => {
                    const categoryFormated = categories.length > 1 ? (<span key={category._id} className='text-sm text-gray-400'>{category.title + ", "}</span>) :
                        (<span key={category._id} className='text-sm text-gray-400'>{category.title}</span>)
                    return categoryFormated
                })}
                <div>
                    <span onClick={handleLikeClick}><i className={`m-2 fa-solid fa-heart  ${isLikedThisPost ? 'text-red-600' : null}`}></i>{" " + likes.length}</span>
                    <span onClick={handleClickDislike}><i className={`m-2 fa-sharp fa-solid fa-heart-crack ${isDislikedThisPost ? 'text-amber-600' : null}`}></i>{" " + dislikes.length}</span>
                    {numComments !== undefined &&
                        <span><i className="m-2 fa-solid fa-comment"></i>{numComments}</span>
                    }
                    <i onClick={handleClickDislike} className="m-2 fa-solid fa-eye float-right">{" " + numViews}</i>
                </div>
            </Card >

        </div >
    )
}

export default Post