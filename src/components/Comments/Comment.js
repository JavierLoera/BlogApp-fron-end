import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteComment } from '../../redux/slices/comments/CommentsSlice';

const Comment = ({ comment, setIsEdit, setCommentToEdit }) => {
    const usersState = useSelector(state => state?.users)
    const dispatch = useDispatch()
    const { userAuth } = usersState;
    const [isReadMore, setIsReadMore] = useState(true)
    const fecha = new Date(comment?.createdAt).toLocaleDateString()

    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

    const handleEditComment = (comment) => {
        setIsEdit(v => !v)
        setCommentToEdit({ id: comment._id, comment: comment.description })
    }

    return (
        <div key={comment._id} className='border-b-2 border-b-black'>
            <div className='w-full'>
                <Link to={`/profile/${comment?.user?._id}`}>
                    <img className='w-5 h-5 rounded-full inline' src={comment?.user?.profilePhoto} alt='profile' />
                    <span className='w-5 h-5 inline ml-1'>{comment?.user?.firstName + " " + comment?.user?.lastName}</span>
                </Link>
                <span className='inline ml-3'>{fecha}</span>
                {userAuth && userAuth?._id === comment?.user?._id &&
                    <span onClick={() => dispatch(deleteComment(comment?._id))} className='m-2 float-right fa-solid fa-trash'></span>
                }
                {userAuth && userAuth?._id === comment?.user?._id &&
                    <span onClick={() => handleEditComment(comment)} className='m-2 float-right fa-regular fa-pen-to-square'></span>
                }
            </div>
            <p className='text-black w-full'>{isReadMore ? comment?.description?.slice(0, 150) : comment?.description}</p>
            {comment?.description.length > 150 &&
                <span onClick={toggleReadMore} className="read-or-hide">
                    {isReadMore ? "... ver mas" : " ver menos"}
                </span>
            }
        </div>)
}

export default Comment