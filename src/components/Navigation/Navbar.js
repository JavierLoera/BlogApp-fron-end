import { Navbar, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/users/userSlices";
import ConditionalLink from "./ConditionalLink";
import decode from 'jwt-decode'
import { useCallback, useEffect, useState } from "react";

const NavbarApp = () => {
    const user = useSelector(store => store?.users?.userAuth);
    const location = useLocation()
    const [userInfo] = useState(JSON.parse(localStorage.getItem('userInfo')))
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = useCallback(() => {
        dispatch(logout());
        navigate('/login')
    }, [dispatch, navigate])

    useEffect(() => {
        const token = userInfo?.token;
        if (token) {
            const decodedToken = decode(token);
            if (decodedToken.exp * 1000 < new Date().getTime()) {
                handleLogout()
            }
        }
    }, [location, handleLogout, userInfo])


    return (
        <>
            <Navbar
                fluid={true}
                rounded={true}
            >
                <Navbar>
                    <ConditionalLink user={!!user} to={`/profile/${user?._id}`}>
                        <div className="flex flex-row items-center">
                            <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Home</span>
                        </div>
                    </ConditionalLink>
                </Navbar>

                <div className="flex md:order-2">
                    {user && (
                        <Dropdown
                            arrowIcon={false}
                            inline={true}
                            label={<Avatar alt="User settings" img={user?.profilePhoto} rounded={true} />}
                        >
                            <Dropdown.Header>
                                <span className="block text-sm">
                                    {user.firstName + " " + user.lastName}
                                </span>
                                <span className="block truncate text-sm font-medium">
                                    {user.email}
                                </span>
                            </Dropdown.Header>
                            <Link to={`/profile/${user?._id}`} className="block py-2 pr-4 pl-3 text-white rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white" aria-current="page">
                                <Dropdown.Item>
                                    Perfil
                                </Dropdown.Item>
                            </Link>
                            <Link to={`/update/user/${user?._id}`} className="block py-2 pr-4 pl-3 text-white rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white" aria-current="page">
                                <Dropdown.Item>
                                    Actualizar datos
                                </Dropdown.Item>
                            </Link>
                            <Link to={`/change-password/${user?._id}`} className="block py-2 pr-4 pl-3 text-white rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white" aria-current="page">
                                <Dropdown.Item>
                                    Cambiar contraseña
                                </Dropdown.Item>
                            </Link>
                            <Link to="/newpost" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                <Dropdown.Item>
                                    Crear
                                </Dropdown.Item>
                            </Link>
                            {user.isAdmin && (
                                <>

                                    <Link to="/categories" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                        <Dropdown.Item>
                                            Categorias
                                        </Dropdown.Item>
                                    </Link>
                                </>
                            )}
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleLogout}>
                                Salir
                            </Dropdown.Item>
                        </Dropdown>
                    )}
                    <Navbar.Toggle />
                </div>




                <Navbar.Collapse className="accent-blue-800">
                    {user?.isAdmin && (
                        <Link to="/authors" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                            <Navbar>
                                Autores
                            </Navbar>
                        </Link>
                    )}
                    <Link to="/posts" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                        <Navbar>
                            Posts
                        </Navbar>
                    </Link>
                    {!user && (
                        <>
                            <Link to="/login" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                <Navbar>
                                    Ingresar
                                </Navbar>
                            </Link>
                            <Link to="/register" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                <Navbar>
                                    Registrarse
                                </Navbar>
                            </Link>
                        </>)}
                </Navbar.Collapse>
            </Navbar>
        </>)
}

export default NavbarApp;