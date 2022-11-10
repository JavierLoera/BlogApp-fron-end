import React, { useState } from 'react'
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { updateUser, uploadImage } from '../../../redux/slices/users/userSlices';

const formSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("last Name is required"),
    bio: Yup.string().required("bio is required"),
});


const UpdateUser = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const store = useSelector(state => state?.users);

    const { userAuth, loading, serverErr, appErr } = store;

    const formik = useFormik({
        initialValues: {
            firstName: userAuth?.firstName ? userAuth.firstName : "",
            lastName: userAuth?.lastName ? userAuth.lastName : "",
            bio: userAuth?.bio ? userAuth.bio : ""
        },
        enableReinitialize: true,
        onSubmit: values => {
            dispatch(updateUser({ id, values }));
            navigate(`/profile/${id}`)
        },
        validationSchema: formSchema,
    });


    const [file, setFile] = useState({
        file: undefined,
        filePreview: ""
    })


    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("image", file.file);
        dispatch(uploadImage(formData))
    }

    const imageUpload = (e) => {
        setFile({
            file: e.target.files[0],
            filePreview: URL.createObjectURL(e.target.files[0])
        })
    }
    return (
        <>
            <div className="w-full">
                <div className="px-4 lg:px-12 py-12 lg:py-24 bg-white shadow-lg rounded-lg">
                    <div className='flex item-center justify-center w-full h-12'>
                        {file.filePreview ?
                            <img className="previewimg" src={file.filePreview} alt="UploadImage" />
                            : null}
                    </div>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <label htmlFor="avatar">Choose a profile picture:</label>
                        <input onChange={(e) => { imageUpload(e) }} className='ml-3' type="file"
                            id="avatar" name="avatar"
                            accept="image/png, image/jpeg" />
                        <button
                            type="submit"
                            className="py-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition duration-200"
                        >
                            Cambiar
                        </button>
                    </form>

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit}>
                        <h3 className="mb-10 text-2xl font-bold font-heading">
                            Cambiar datos
                        </h3>
                        {/* display err */}
                        {serverErr || appErr ? (
                            <h2 className="text-red-500">
                                {serverErr} - {appErr}
                            </h2>
                        ) : null}
                        <div className="flex items-center pl-3 mb-3 border border-gray-50 bg-white ">
                            {/* firstName*/}
                            <input
                                value={formik.values.firstName}
                                onChange={formik.handleChange("firstName")}
                                onBlur={formik.handleBlur("firstName")}
                                className="w-full pr-4 pl-4 py-4 font-bold placeholder-gray-300  focus:outline-none"
                                type="text"
                                placeholder="Nombre"
                            />
                        </div>
                        {/* Err message */}
                        <div className="text-red-400 mb-2">
                            {formik.touched.firstName && formik.errors.firstName}
                        </div>
                        {/* lastName */}
                        <div className="flex items-center pl-3 mb-3 border border-gray-50 bg-white ">
                            <input
                                value={formik.values.lastName}
                                onChange={formik.handleChange("lastName")}
                                onBlur={formik.handleBlur("lastName")}
                                className="w-full pr-6 pl-4 py-4 font-bold placeholder-gray-300  focus:outline-none"
                                type="text"
                                placeholder="Apellido"
                            />
                        </div>
                        {/* Err msg */}
                        <div className="text-red-400 mb-2">
                            {formik.touched.lastName && formik.errors.lastName}
                        </div>

                        <div className="flex items-center pl-3 mb-3 border border-gray-50 bg-white ">
                            <textarea
                                className="w-full pr-6 pl-4 py-4 font-bold placeholder-gray-300  focus:outline-none"
                                name="textarea" rows="10" cols="50"
                                placeholder="bio"
                                value={formik.values.bio}
                                onChange={formik.handleChange("bio")}
                                onBlur={formik.handleBlur("bio")}
                                type="text" />
                        </div>
                        {/* Err message */}
                        <div className="text-red-400 mb-2">
                            {formik.touched.bio && formik.errors.bio}
                        </div>
                        {/* bio */}



                        {loading ? (
                            <button
                                disabled
                                className="py-4 w-full bg-gray-500 text-white font-bold rounded-full transition duration-200"
                            >
                                cargando...
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="py-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition duration-200"
                            >
                                Cambiar
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};


export default UpdateUser


