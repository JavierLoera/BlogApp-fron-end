import React from 'react'
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { changePassword, resetPassword } from '../../../redux/slices/users/userSlices';

const formSchema = Yup.object({
    password: Yup.string().required("La contraseña es requerida").min(5, 'La contraseña debe contener 5 carateres minimo.')
        .matches(/[a-zA-Z]/, 'La contraseña Solo debe tener letras.'),
    confirmPassword: Yup.string().required("La contraseña es requerida").oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
});

const ResetPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useParams();

    const userAuth = useSelector(store => store.users.userAuth)

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: ""
        },
        onSubmit: values => {
            if (userAuth === '') {
                dispatch(resetPassword({ password: values.password, token }));
                navigate(`/login`)
            }
            if (userAuth) {
                dispatch(changePassword(values.password));
                navigate(`/profile/${userAuth._id}`)
            }
        },
        validationSchema: formSchema,
    });

    return (
        <>
            <section className="min-h-screen max-h-full relative py-20 2xl:py-40 bg-gray-900 overflow-hidden ">
                <div className="relative container px-4 mx-auto flex items-center">
                    <div className="max-w-5xl mx-auto flex items-center">
                        <div className="flex flex-wrap items-center -mx-4">
                            <div className="w-full px-4">
                                <div className="px-6 lg:px-12 py-12 lg:py-24 bg-white shadow-lg rounded-lg">

                                    <form onSubmit={formik.handleSubmit}>
                                        <h3 className="mb-10 text-2xl font-bold font-heading">
                                            Cambiar contraseña
                                        </h3>
                                        <div className="flex items-center pl-3 mb-3 border border-gray-50 bg-white ">
                                            {/* password*/}
                                            <input
                                                value={formik.values.password}
                                                onChange={formik.handleChange("password")}
                                                onBlur={formik.handleBlur("password")}
                                                className="w-full pr-4 pl-4 py-4 font-bold placeholder-gray-300  focus:outline-none"
                                                type="text"
                                                placeholder="Password"
                                            />
                                        </div>
                                        {/* Err message */}
                                        <div className="text-red-400 mb-2">
                                            {formik.touched.password && formik.errors.password}
                                        </div>
                                        <div className="flex items-center pl-3 mb-3 border border-gray-50 bg-white ">
                                            {/* confirm password*/}
                                            <input
                                                value={formik.values.confirmPassword}
                                                onChange={formik.handleChange("confirmPassword")}
                                                onBlur={formik.handleBlur("confirmPassword")}
                                                className="w-full pr-4 pl-4 py-4 font-bold placeholder-gray-300  focus:outline-none"
                                                type="text"
                                                placeholder="Confirma la contraseña"
                                            />
                                        </div>
                                        {/* Err message */}
                                        <div className="text-red-400 mb-2">
                                            {formik.touched.confirmPassword && formik.errors.confirmPassword}
                                        </div>

                                        <button
                                            type="submit"
                                            className="py-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition duration-200"
                                        >
                                            Enviar
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </>
    );
};


export default ResetPassword