import React from 'react'
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { forgetPassword } from '../../../redux/slices/users/userSlices';

const formSchema = Yup.object({
    email: Yup.string().required("Email es requerido"),
});

const ChangePassword = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            email: ""
        },
        onSubmit: values => {
            dispatch(forgetPassword(values));
            navigate(`/login`)
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

                                    {/* Form */}
                                    <form onSubmit={formik.handleSubmit}>
                                        <h3 className="mb-10 text-2xl font-bold font-heading">
                                            Cambiar contraseña
                                        </h3>
                                        <div className="flex items-center pl-3 mb-3 border border-gray-50 bg-white ">
                                            {/* firstName*/}
                                            <input
                                                value={formik.values.email}
                                                onChange={formik.handleChange("email")}
                                                onBlur={formik.handleBlur("email")}
                                                className="w-full pr-4 pl-4 py-4 font-bold placeholder-gray-300  focus:outline-none"
                                                type="text"
                                                placeholder="Email"
                                            />
                                        </div>
                                        {/* Err message */}
                                        <div className="text-red-400 mb-2">
                                            {formik.touched.email && formik.errors.email}
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



export default ChangePassword
