import { Spinner, Table } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { createCategory, deleteCategory, fetchCategories, updateCategory } from '../../api/categories'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import "./Categories.css"
import { useSelector } from 'react-redux'

const formSchema = Yup.object({
    title: Yup.string().required("El titulo es requerido")
})


const Categories = () => {
    const [categories, setCategories] = useState({ cargando: true, categories: [] })
    const [error, setError] = useState({ networkError: '' });
    const [isEdit, setIsEdit] = useState(false);
    const [idIsEdit, setIdIsEdit] = useState('')
    const { userAuth } = useSelector(state => state?.users);

    const formik = useFormik({
        initialValues: {
            title: ''
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            if (isEdit) {
                updateCategory(idIsEdit, values.title).then(v => {
                    values.title = ""
                    setIdIsEdit("")
                    setIsEdit(false)
                })
            }
            else { createCategory(values.title).then(v => values.title = "") };

        },
        validationSchema: formSchema
    })

    useEffect(() => {
        fetchCategories().then(res => {
            if (res.code === 'ERR_NETWORK') {
                setError({ ...error, networkError: 'Ha ocurrido un error de red' })
                setCategories({ cargando: false, categories: undefined })
            }
            else { setCategories({ cargando: false, categories: res }) }
        })
    }, [categories, error])

    const handleClickDelete = async (id) => {
        await deleteCategory(id)
    }

    const handleClickEdit = async (id) => {
        setIsEdit(true)
        const category = categories.categories.filter(categoriy => categoriy._id === id);
        formik.setFieldValue("title", category[0].title);
        setIdIsEdit(category[0]._id)
    }

    const handleClickCancelEdit = () => {
        setIsEdit(false);
        setIdIsEdit("");
        formik.setFieldValue("title", '');
    }

    return (
        <div className='flex w-full flex-col lg:flex-row'>
            <div className='w-full order-last lg:order-1  lg:w-4/6 bg-green-50'>
                {error.networkError &&
                    <h3 className='text-red-300 text-center text-2xl'>{error.networkError}</h3>}

                {categories.cargando &&
                    (<div className='spinner_container'>
                        <Spinner aria-label="Extra large spinner" size="xl" />
                    </div>)
                }
                {!categories.cargando && !error.networkError && <Table>
                    <Table.Head>
                        <Table.HeadCell>
                            Id
                        </Table.HeadCell>
                        <Table.HeadCell>
                            Categoria
                        </Table.HeadCell>
                        <Table.HeadCell>
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {categories !== undefined && categories.categories?.map((category) => {
                            return (
                                <Table.Row key={category._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {category._id}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {category.title}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <button onClick={() => handleClickEdit(category._id)} className='m-3'><i className="fa-solid fa-pen"></i></button>
                                        <button onClick={() => handleClickDelete(category._id)} className='m-3'><i className="fa-regular fa-trash-can"></i></button></Table.Cell>
                                </Table.Row>)
                        })}
                    </Table.Body>
                </Table>}
            </div>
            {userAuth?.isAdmin &&
                <div className='w-full lg:w-2/6 bg-red-200'>
                    <form className='w-full p-2' onSubmit={formik.handleSubmit}>
                        <input
                            className="w-full pr-6 pl-4 py-4 font-bold placeholder-gray-400 rounded-r-lg rounded-l-lg focus:outline-none"
                            type="text"
                            value={formik.values.title}
                            onChange={formik.handleChange("title")}
                            onBlur={formik.handleBlur("title")}
                            placeholder="Ingrese un titulo"
                        />
                        <div className="text-red-400 mb-2">
                            {formik.touched.title && formik.errors.title}
                        </div>
                        <button className="w-full h-10 my-6 btn p-2 bg-gray-800 text-white font-semibold" type="submit">Crear</button>
                        {isEdit && <button onClick={handleClickCancelEdit} className="w-full h-10  btn p-2 bg-red-500 text-white font-semibold" type="submit">Cancelar</button>
                        }
                    </form>
                </div>
            }
        </div>
    )
}

export default Categories
