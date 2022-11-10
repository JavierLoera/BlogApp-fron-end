import { Spinner, Table } from 'flowbite-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers } from '../../redux/slices/users/userSlices'
import TableRow from './TableRow'
import "./Author.css"

const Authors = () => {
    const dispatch = useDispatch();
    const store = useSelector(state => state.users)
    const { serverErr, appErr, authors } = store

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch, store])

    if (!authors) {
        return (<div className='spinner_container'>
            <Spinner aria-label="Extra large spinner" size="xl" />
        </div>)
    }
    return (
        <>
            {serverErr || appErr ? (
                <h2 className="text-red-500">
                    {serverErr} - {appErr}
                </h2>
            ) : null}

            <Table striped={true}>
                <Table.Head>
                    <Table.HeadCell>
                        id
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Active
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Name
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Block/Unblock
                    </Table.HeadCell>
                    <Table.HeadCell>
                        Eliminar Usuario
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {authors?.map((user) => {
                        return (
                            <TableRow key={user._id} user={user} />
                        )
                    })}
                </Table.Body>
            </Table>
        </>
    )
}

export default Authors