import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { clearMessageChangePassword, fetchUserDetails, generateTokenVerification, toggleFollowUser } from '../../../redux/slices/users/userSlices'
import "./Perfil.css"
import withReactContent from 'sweetalert2-react-content'
import Post from '../../Posts/Post'
import Page404 from '../../Page404'


const Perfil = () => {
    const dispatch = useDispatch();
    const { id } = useParams()
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal)
    const store = useSelector(store => store.users)


    const { appErr, serverErr, userDetails, userAuth, isPasswordUpdated } = store
    const userLogged = userAuth?._id === id

    const isFolledThisUser = userDetails?.followers.find((elem) => elem === userAuth._id)

    const handleClickFollow = () => {
        if (!userAuth) {
            return navigate('/login')
        }
        if (userAuth) {
            return dispatch(toggleFollowUser(id))
        }
    }


    const handleAlert = () => {
        setTimeout(() => dispatch(clearMessageChangePassword()), 3000)
        return (
            <div className='bg-green-500 w-full'>
                <h2 className="text-center text-white">
                    "La contraseña se ha cambiado correctamente"
                </h2>
            </div>)
    }

    const handleClickGenerateToken = () => {
        dispatch(generateTokenVerification())
        let timerInterval
        MySwal.fire({
            title: 'Un token se ha enviado a tu cuenta de correo',
            timer: 2000,
            willClose: () => {
                clearInterval(timerInterval)
            }
        })
    }

    useEffect(() => {
        dispatch(fetchUserDetails(id))
    }, [id, userAuth, dispatch])


    useEffect(() => {
        let timer = setTimeout(() => {
            if (!userDetails) {
                return <Page404 />
            }
        }, 2000)
        return () => {
            clearTimeout(timer);
        };
    }, [userDetails])

    return (
        <>
            <div className="container mx-auto">
                {(userAuth && !userAuth?.isAccountVerified) && (<div className='p-2 bg-red-500 w-full'>
                    <h2 className="text-center text-white inline-block text-lg">
                        Tu cuenta no esta verificada, da click aqui para verificar tu cuenta y poder crear posts
                    </h2><button onClick={() => handleClickGenerateToken()} className='underline ml-3 text-white'>Click</button>
                </div>)}


                {serverErr || appErr ? (
                    <h2 className="text-red-500">
                        {serverErr} - {appErr}
                    </h2>
                ) : null}
                {isPasswordUpdated ?
                    handleAlert() : null}

                <div className='h-32 md:h-40  lg:h-52 w-full  bg-slate-600 flex '>
                    <div className=' w-1/5 md:w-1/6 md:h-full md:rounded-none self-end rounded-full'>
                        <img className='rounded-full md:rounded-none' alt='profile' src={userDetails?.profilePhoto} />
                    </div>
                    <h5 className='self-end mx-4 text-2xl'>{(userDetails && userDetails?.firstName + " " + userDetails?.lastName)}</h5>
                </div>
                <p className='text-center text-lg font-bold p-3'>
                    <span>{userDetails?.followers.length} followers</span>
                    <span className='p-3'>{userDetails?.following?.length} following</span>
                    <span>{userDetails?.posts?.length} posts</span>

                    {!userLogged && (isFolledThisUser ? (<button onClick={handleClickFollow} className='ml-20 w-30 bg-red-400 rounded-md'>Dejar de seguir</button>) : (<button onClick={handleClickFollow} className='ml-20 w-20 bg-green-400 rounded-md'>Seguir</button>))}
                </p>
                <p className='text-center text-xl mt-20 xl:mt-40'>{userDetails?.bio}</p>


                {userDetails?.posts.length === 0 && <p className='p-8 text-center text-5xl'>sin posts</p>}

                <div className='flex items-center flex-col mt-10 xl:mt-22 mb-3'>
                    {userDetails?.posts?.map((post) => {
                        return (
                            <Post key={post._id}
                                id={post._id}
                                title={post.title}
                                image={post.image}
                                description={post.description}
                                postUser={post?.user}
                                user={{ userAuthId: userAuth?._id, firstName: userDetails?.firstName, lastName: userDetails?.lastName }}
                                categories={post.category}
                                date={post.createdAt}
                                dislikes={post?.disLikes}
                                likes={post?.likes}
                                numViews={post.numViews}
                            />
                        )
                    })}
                </div>

            </div>
        </>

    )
}

export default Perfil