import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { registerUserAction } from "../../../redux/slices/users/userSlices";

const formSchema = Yup.object({
    firstName: Yup.string().required("El nombr es requerido"),
    lastName: Yup.string().required("El apellido es requerido"),
    email: Yup.string().required("El email es requerido"),
    password: Yup.string().required("La contraseña es requerida"),
});


const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userAuth } = useSelector(state => state?.users)

    console.log(userAuth)
    useEffect(() => {
        if (userAuth) { return navigate(`/profile/${userAuth?._id}`) }
    })

    //formik
    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
        onSubmit: values => {
            dispatch(registerUserAction(values));
            navigate('/login')
        },
        validationSchema: formSchema,
    });

    const storeData = useSelector(store => store?.users);
    const { loading, appErr, serverErr, registered } = storeData;


    if (registered) {
        return navigate("/profile");
    }

    return (
        <section className="relative py-20 2xl:py-40 bg-gray-800 overflow-hidden">
            <div className="relative container px-4 mx-auto">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-wrap items-center -mx-4">
                        <div className="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
                            <div className="max-w-md">
                                <span className="text-lg text-blue-400 font-bold">
                                    Registrarse
                                </span>
                                <h2 className="mt-8 mb-2 text-5xl font-bold font-heading text-white">
                                    Crear un cuenta
                                </h2>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 px-4">
                            <div className="px-6 lg:px-20 py-12 lg:py-24 bg-gray-600 rounded-lg">
                                <form onSubmit={formik.handleSubmit}>
                                    <h3 className="mb-10 text-2xl text-white font-bold font-heading">
                                        {appErr || serverErr ? (
                                            <div className="text-red-400">
                                                {serverErr} {appErr}
                                            </div>
                                        ) : null}
                                    </h3>

                                    {/* First name */}
                                    <div className="flex items-center mb-3 bg-white rounded-full">
                                        <input
                                            value={formik.values.firstName}
                                            onChange={formik.handleChange("firstName")}
                                            onBlur={formik.handleBlur("firstName")}
                                            className="w-full pl-4 pr-6 py-4 font-bold placeholder-gray-400 rounded-r-full  rounded-l-full focus:outline-none"
                                            type="text"
                                            placeholder="Nombre"
                                        />
                                    </div>
                                    {/* Err msg*/}
                                    <div className="text-red-400 mb-2">
                                        {formik.touched.firstName && formik.errors.firstName}
                                    </div>
                                    {/* Last name */}
                                    <div className="flex items-center mb-3 bg-white rounded-full">
                                        <input
                                            value={formik.values.lastName}
                                            onChange={formik.handleChange("lastName")}
                                            onBlur={formik.handleBlur("lastName")}
                                            className="w-full pl-4 pr-6 py-4 font-bold placeholder-gray-400 rounded-r-full rounded-l-full focus:outline-none"
                                            type="text"
                                            placeholder="Apellido"
                                        />
                                    </div>
                                    {/* Err msg*/}
                                    <div className="text-red-400 mb-2">
                                        {formik.touched.lastName && formik.errors.lastName}
                                    </div>
                                    {/* Email */}
                                    <div className="flex items-center  mb-3 bg-white rounded-full">
                                        <input
                                            value={formik.values.email}
                                            onChange={formik.handleChange("email")}
                                            onBlur={formik.handleBlur("email")}
                                            className="w-full pl-4 pr-6 py-4 font-bold placeholder-gray-400 rounded-r-full rounded-l-full focus:outline-none"
                                            type="email"
                                            placeholder="correo@gmail.com"

                                        />
                                    </div>
                                    {/* Err msg*/}
                                    <div className="text-red-400 mb-2">
                                        {formik.touched.email && formik.errors.email}
                                    </div>
                                    <div className="flex items-center mb-3 bg-white rounded-full">
                                        <input
                                            value={formik.values.password}
                                            onChange={formik.handleChange("password")}
                                            onBlur={formik.handleBlur("password")}
                                            className="w-full pl-4 pr-6 py-4 font-bold placeholder-gray-400 rounded-r-full  rounded-l-full focus:outline-none"
                                            type="password"
                                            placeholder="Password"
                                        />
                                    </div>
                                    {/* Err msg*/}
                                    <div className="text-red-400 mb-2">
                                        {formik.touched.password && formik.errors.password}
                                    </div>

                                    <div className="inline-flex mb-10"></div>

                                    {loading ? (
                                        <button
                                            disabled
                                            className="py-4 w-full bg-gray-500  text-white font-bold rounded-full transition duration-200"
                                        >
                                            Creando...
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="py-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition duration-200"
                                        >
                                            Registrarse
                                        </button>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
