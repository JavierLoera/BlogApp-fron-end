import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { verifyToken } from '../../../redux/slices/users/userSlices';

const Token = () => {
    const { token } = useParams();
    const userAuth = useSelector(store => store.users.userAuth)
    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(verifyToken(token));
        navigate(`/perfil/${userAuth._id}`)
    })

    return (
        <div className='flex items-center justify-center w-full h-screen bg-slate-400'>
            <div className='w-50 h-60'>
                <p className='text-center text-5xl text-white'>Tu cuenta se ha verficado con exito,ya puedes cerrar esta ventana</p>
            </div>

        </div>
    )
}

export default Token