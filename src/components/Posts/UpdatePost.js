import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { fetchCategories } from '../../api/categories'
import { fetchpostDetails, updatePost } from '../../redux/slices/posts/postsSlice'
import Select from 'react-select';
import makeAnimated from 'react-select/animated'



const formSchema = Yup.object({
    title: Yup.string().required("El titulo es requerido"),
    categories: Yup.array().min(1, "Al menos una categoria es requerida").required(),
    description: Yup.string().required("La description es requerida")
})

const animatedComponents = makeAnimated();

const UpdatePost = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [categories, setCategories] = useState()
    const { postDetails } = useSelector(state => state.posts)
    const { id } = useParams()

    useEffect(() => {
        dispatch(fetchpostDetails(id))
    }, [dispatch, id])

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
            title: postDetails?.title ? postDetails?.title : '',
            description: postDetails?.description ? postDetails?.description : '',
            categories: []
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            const formData = new FormData();
            for (let i = 0; i < values.categories.length; i++) {
                formData.append('categories', values.categories[i].id)
            }
            formData.append("title", values.title)
            formData.append("description", values.description);
            dispatch(updatePost({ id, values: formData }))
            navigate(`/post/details/${id}`)
        },
        validationSchema: formSchema
    })

    return (
        <div className='w-full h-5/6 items-center flex justify-center'>
            <div className='sm:w-full md:w-2/4'>
                <form className='p-3' onSubmit={formik.handleSubmit}>
                    <h3 className="mb-10 text-2xl text-center font-bold font-heading">
                        {/* Header */}
                        Editar Post
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
                        rows="10"
                        value={formik.values.description}
                        onChange={formik.handleChange("description")}
                        onBlur={formik.handleBlur("description")}
                        className="w-full pr-6 pl-4 py-4 font-bold placeholder-gray-400 rounded-r-lg rounded-l-lg focus:outline-none"
                        type="text"
                        placeholder="Ingresa una descripcion"
                    />
                    {/* Err message title */}
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
                    <div className="text-red-400 mb-2">
                        {formik.touched.categories && formik.errors.categories}
                    </div>
                    <button className="w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" type='submit'>Actualizar</button>
                </form>
            </div>
        </div>
    )
}

export default UpdatePost