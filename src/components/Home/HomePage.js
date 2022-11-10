import React from 'react'
import { Link } from 'react-router-dom'
import imgHome from "../../img/Wall post.gif"

const HomePage = () => {
    return (
        <>
            <div className='min-h-screen flex w-full flex-col lg:flex-row bg-[#161d26]'>
                <div className='flex items-center justify-center flex-col w-full lg:order-1  lg:w-3/6 bg-green-50'>
                    <img alt='principal' src={imgHome}></img>
                </div>
                <div className='w-full lg:w-3/6 flex items-center justify-center flex-col'>
                    <h2 className='text-center py-8 text-[#b56e49] text-5xl'>Crea posts y sigue</h2>
                    <div className='p-4 m-4'>
                        <Link to={'/login'}>
                            <button className=" m-4 bg-transparent text-[#ffafd9] font-semibold hover:text-white py-2 px-4 border border-[#f2f2f2] hover:border-transparent rounded">
                                Entrar
                            </button>
                        </Link>
                        <Link to={'/register'}>
                            <button className=" m-4 bg-transparent text-[#ffafd9] font-semibold hover:text-white py-2 px-4 border border-[#f2f2f2] hover:border-transparent rounded">
                                Registrarse
                            </button>
                        </Link>


                    </div>

                </div>
            </div>

        </>
    )
}




export default HomePage