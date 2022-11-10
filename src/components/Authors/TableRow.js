import { Badge, Button, Table } from 'flowbite-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { blockUser, deleteUser } from '../../redux/slices/users/userSlices'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Link } from "react-router-dom"

const TableRow = ({ user }) => {
    const dispatch = useDispatch()
    const MySwal = withReactContent(Swal)


    const handleDeleteUser = (id) => {
        MySwal.fire({
            title: 'De verdad deseas eliminar este usuario?',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteUser(id))
            }
        })
    }

    const handleBlockUser = (id) => {
        dispatch(blockUser(id))
    }

    return (
        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {user._id}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {user.active ? <Badge
                    color="gray"
                ><i style={{ color: "green" }} className="fa-sharp fa-solid fa-circle" /></Badge> : <Badge
                    color="green"
                ><i style={{ color: "red" }} className="fa-sharp fa-solid fa-circle" /></Badge>}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {user.firstName + " " + user.lastName}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {user.isBlocked ? (<Button onClick={() => handleBlockUser(user._id)} >Unlock</Button>) : <Button onClick={() => handleBlockUser(user._id)} color="failure">Block</Button>}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                <Button onClick={() => handleDeleteUser(user._id)} color="warning">Eliminar</Button>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                <Link to={`/profile/${user._id}`}>
                    <Button>Ver perfil</Button>
                </Link >
            </Table.Cell>
        </Table.Row>

    )

}

export default TableRow