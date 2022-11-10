import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { disLikePost, fetchpostDetails, likePost } from '../../redux/slices/posts/postsSlice';
import { createComment, updateComment } from '../../redux/slices/comments/CommentsSlice';
import { useFormik } from 'formik';
import * as Yup from "yup";
import Comment from '../Comments/Comment';
import Page404 from '../Page404';

const formSchema = Yup.object({
    description: Yup.string().required('El comentario es requerido')
})

const PostDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams()
    const navigate = useNavigate()
    const postsState = useSelector(state => state?.posts)
    const usersState = useSelector(state => state?.users)
    const { postDetails } = postsState;
    const { userAuth } = usersState;
    const ref = useRef(null);
    const [isEdit, setIsEdit] = useState(false);
    const [commentToEdit, setCommentToEdit] = useState({
        id: '',
        comment: ''
    })

    //usado para controlar si se hace click en otra parte del formulario cerrar el modo edit 
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsEdit(false);
                setCommentToEdit({ id: '', comment: '' })
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [isEdit]);

    const formik = useFormik({
        initialValues: {
            description: isEdit ? commentToEdit.comment : ''
        },
        enableReinitialize: true,
        onSubmit: values => {
            if (!userAuth) return navigate('/login')
            if (isEdit) {
                dispatch(updateComment({ postId: id, description: values.description, commentId: commentToEdit.id }))
                setIsEdit(false)
                values.description = ''
            } else {
                dispatch(createComment({ postId: id, description: values.description }))
                values.description = ''
            }

        }
        ,
        validationSchema: formSchema

    })


    useEffect(() => {
        dispatch(fetchpostDetails(id))
    }, [dispatch, id])


    const dateFormated = new Date(postDetails?.createdAt);
    const isLikedThisPost = postDetails?.likes?.find(id => id === userAuth?._id);
    const isDislikedThisPost = postDetails?.disLikes?.find(id => id === userAuth?._id);

    const handleLikeClick = () => {
        if (!userAuth) return navigate('/login')
        dispatch(likePost(id));
    }

    const handleClickDislike = () => {
        if (!userAuth) return navigate('/login')
        dispatch(disLikePost(id))
    }

    useEffect(() => {
        let timer = setTimeout(() => {
            if (!postDetails) {
                return <Page404 />
            }
        }, 2000)
        return () => {
            clearTimeout(timer);
        };
    }, [postDetails])

    return (
        <>
            {postDetails && (
                <div className='mx-11' >
                    <div className="flex justify-center w-full">
                        <div>
                            <img src={postDetails?.image} alt='post' />
                        </div>
                    </div >
                    <div className='p-3'>
                        {postDetails?.category.map(category => {
                            const categoryFormated = postDetails?.category?.length > 1 ? (<span key={category._id} className='text-sm text-gray-400'>{category.title + ", "}</span>) :
                                (<span key={category._id} className='text-sm text-gray-400'>{category.title}</span>)
                            return categoryFormated
                        })}

                        {userAuth?._id === postDetails?.user?._id &&
                            <Link to={`/update/post/${id}`}>
                                <span className='inline float-right'><i className='m-2 float-right fa-regular fa-pen-to-square'></i></span>
                            </Link>
                        }
                        <div className='mt-3'>
                            <span onClick={handleLikeClick}><i className={`m-2 fa-solid fa-heart  ${isLikedThisPost ? 'text-red-600' : null}`}></i>{postDetails?.likes.length}</span>
                            <span onClick={handleClickDislike}><i className={`m-2 fa-sharp fa-solid fa-heart-crack ${isDislikedThisPost ? 'text-amber-600' : null}`}></i>{postDetails?.disLikes.length}</span>
                            <i className="m-2 fa-solid fa-eye float-right">{" " + postDetails?.numViews}</i>
                        </div>
                        <p>{postDetails?.user?.firstName + " " + postDetails?.user?.lastName}</p>
                    </div>
                    <div className='m-3'>
                        <span className='block text-right'>{dateFormated?.toLocaleDateString()}</span>
                    </div>
                    <div className='text-center text-3xl'>
                        <h3>{postDetails?.title}</h3>
                    </div>
                    <div className='m-1 mb-5'>
                        {postDetails?.description}
                    </div>
                    <div className='w-full h-fit border border-black p-2 mb-5'>
                        <h3 className='mb-6'>comentarios:</h3>
                        {postDetails?.comments?.map(comment =>
                            <Comment key={comment._id} comment={comment} setIsEdit={setIsEdit} setCommentToEdit={setCommentToEdit} />
                        )}
                        <form ref={ref} className='mt-7' onSubmit={formik.handleSubmit}>
                            <label>{isEdit ? 'Editar Comentario' : 'Crear un commentario'}</label>
                            <input value={formik.values.description} onChange={formik.handleChange('description')} onBlur={formik.handleBlur("description")} className='w-full rounded-md' type='text'></input>
                            <div className="text-red-400 mb-2">
                                {formik.touched.description && formik.errors.description}
                            </div>
                            <button className="w-30 inline bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full" type='submit'>Comentar</button>
                        </form>
                    </div>
                </div >
            )}
        </>
    )
}

export default PostDetails