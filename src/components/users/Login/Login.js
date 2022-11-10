import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { clearMessageResetPassword, loginUserAction } from "../../../redux/slices/users/userSlices";
import { useEffect } from "react";

const formSchema = Yup.object({
    email: Yup.string().required("El email es requerido"),
    password: Yup.string().required("La contraseña es requerida"),
});

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    useEffect(() => {
        if (userAuth) { return navigate(`/profile/${userAuth?._id}`) }
    })

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: values => {
            dispatch(loginUserAction(values));
        },
        validationSchema: formSchema,
    });


    const resetMessageForgetPass = () => {
        setTimeout(() => dispatch(clearMessageResetPassword()), 5000)
    }

    useEffect(() => {
        resetMessageForgetPass()
    })

    const store = useSelector(state => state?.users);
    const { messageForgetPassword, userAuth, serverErr, appErr } = store;

    return (
        <>
            <section className="min-h-screen flex items-center justify-center  py-12 2xl:py-40 bg-gray-900 overflow-hidden">
                <div className="w-full lg:w-2/5 px-4">
                    <div className="px-6 lg:px-12 py-12 lg:py-24 bg-white shadow-lg rounded-lg">
                        {messageForgetPassword ? (
                            <h2 className="text-green-500">
                                {messageForgetPassword}
                            </h2>
                        ) : null}

                        {/* Form */}
                        <form onSubmit={formik.handleSubmit}>
                            <h3 className="mb-10 text-2xl text-center font-bold font-heading">
                                {/* Header */}
                                Iniciar sesion
                            </h3>
                            {/* display err */}
                            {serverErr || appErr ? (
                                <h2 className="text-red-500">
                                    {serverErr} - {appErr}
                                </h2>
                            ) : null}

                            {/* Email */}
                            <input
                                value={formik.values.email}
                                onChange={formik.handleChange("email")}
                                onBlur={formik.handleBlur("email")}
                                className="w-full pr-6 pl-4 py-4 font-bold placeholder-gray-400 rounded-r-full rounded-l-full focus:outline-none"
                                type="email"
                                placeholder="enter email"
                            />
                            {/* Err message */}
                            <div className="text-red-400 mb-2">
                                {formik.touched.email && formik.errors.email}
                            </div>
                            {/* Password */}
                            <input
                                value={formik.values.password}
                                onChange={formik.handleChange("password")}
                                onBlur={formik.handleBlur("password")}
                                className="w-full pr-6 pl-4 py-4 font-bold placeholder-gray-400 rounded-r-full rounded-l-full focus:outline-none"
                                type="password"
                                placeholder=" Password"
                            />
                            {/* Err msg */}
                            <div className="text-red-400 mb-2">
                                {formik.touched.password && formik.errors.password}
                            </div>
                            <button
                                type="submit"
                                className="py-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition duration-200"
                            >
                                Iniciar sesion
                            </button>
                        </form>
                        <div className="p-3">
                            <Link
                                to="/forget-password"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Login;