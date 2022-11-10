import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { createPost } from "../../redux/slices/posts/postsSlice";
import { useEffect, useState } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated'
import { fetchCategories } from "../../api/categories";
import { useNavigate } from "react-router-dom";


const SUPPORTED_FORMATS = ["image/jpg", "image/png", "image/jpeg", "image/gif"];
const formSchema = Yup.object({
    title: Yup.string().required("El titúlo es requerido"),
    description: Yup.string().required("La descripcion es requerida"),
    categories: Yup.array(),
    image: Yup.mixed().nullable().required("La imagen del post es requerida")
        .test(
            "size",
            "El tamaño del archivo es muy grande",
            (value) => value && value.size <= 1024 * 1024)
        .test(
            "type",
            "solo formatos [png,jpg,jpeg,gif]",
            (value) =>
                !value || (value && SUPPORTED_FORMATS.includes(value?.type))
        ),
});

const animatedComponents = makeAnimated();

const PostForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [categories, setCategories] = useState();
    const posts = useSelector(state => state?.posts);
    const { serverErr, postError } = posts;


    useEffect(() => {
        fetchCategories().then(res => {
            const categoriesChanged = res.map(category => {
                return (
                    {
                        id: category._id,
                        value: category.title,
                        label: category.title,
                        isFixed: true
                    }
                )
            })
            setCategories(categoriesChanged)
        })
    }, [])

    const formik = useFormik({
        initialValues: {
            title: "",
            categories: [],
            description: "",
            image: null,
            preview: null
        },
        onSubmit: async values => {
            const formData = new FormData();
            for (let i = 0; i < values.categories.length; i++) {
                formData.append('categories', values.categories[i].id)
            }
            formData.append("title", values.title)
            formData.append("description", values.description);
            formData.append("image", values.image);
            await dispatch(createPost(formData));
            navigate(`/post/details/${localStorage.getItem('postId')}`)

        },
        validationSchema: formSchema,
    });


    return (
        <>
            {serverErr || postError ? (
                <h2 className="text-red-500">
                    {serverErr} - {postError}
                </h2>
            ) : null}

            <div className="w-full flex justify-center">
                <div className='w-50 h-fit lg:w-2/4  bg-green-200 p-2 m-3'>

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit}>
                        <h3 className="mb-10 text-2xl text-center font-bold font-heading">
                            {/* Header */}
                            Crear un post
                        </h3>

                        <input
                            value={formik.values.title}
                            onChange={formik.handleChange("title")}
                            onBlur={formik.handleBlur("title")}
                            className="w-full pr-6 pl-4 py-4 font-bold placeholder-gray-400 rounded-r-lg rounded-l-lg focus:outline-none"
                            type="text"
                            placeholder="Ingresa un titulo"
                        />
                        {/* Err message title */}
                        <div className="text-red-400 mb-2">
                            {formik.touched.title && formik.errors.title}
                        </div>
                        <textarea
                            name="textarea" rows="10" cols="2"
                            value={formik.values.description}
                            onChange={formik.handleChange("description")}
                            onBlur={formik.handleBlur("description")}
                            className="w-full pr-6 pl-4 py-4 font-bold placeholder-gray-400 rounded-r-lg rounded-l-lg focus:outline-none"
                            type="text"
                            placeholder="Ingresa una descripción"
                        />
                        {/* Err message */}
                        <div className="text-red-400 mb-2">
                            {formik.touched.description && formik.errors.description}
                        </div>
                        <Select
                            value={formik.values.categories}
                            onChange={(category) =>
                                formik.setFieldValue('categories', category)
                            }
                            onBlur={formik.handleBlur("categories")}
                            className="w-full mb-2 font-bold placeholder-gray-400 rounded-r-lg rounded-l-lg focus:outline-none"
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={categories}
                        />

                        {formik.values.image !== null ?
                            <img src={formik.values.preview} alt="UploadImage" />
                            : null}
                        <input name="image" type="file"
                            onChange={(event) => {
                                formik.setTouched({
                                    image: true,
                                });
                                if (event.target.files[0]) {
                                    formik.setFieldValue("preview", URL.createObjectURL(event.target.files[0]));
                                    formik.setFieldValue("image", event.target.files[0]);
                                }
                            }}
                        />
                        <div className="text-red-400 mb-2">
                            {formik.touched.image && formik.errors.image}
                        </div>

                        <button className="w-full h-10 my-6 btn p-2 bg-gray-800 text-white font-semibold" type="submit">Crear</button>
                    </form>
                </div>
            </div >
        </>
    )
}

export default PostForm