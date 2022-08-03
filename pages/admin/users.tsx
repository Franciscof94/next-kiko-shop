import React, { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/layouts'
import styled from 'styled-components'
import { FiUsers } from 'react-icons/fi'
import useSWR from 'swr'
import { IUser } from '../../interfaces'
import { tesloApi } from '../../api'
import { db } from '../../database'
import { jwt } from '../../utils'
import { GetServerSideProps } from 'next'
import { User } from '../../models'


const UserPage = () => {

    const { data, error } = useSWR<IUser[]>('/api/admin/users')
    const[users, setUsers] = useState<IUser[]>([])

    useEffect(() => {
        if (data) {
            setUsers(data)
        }
    }, [data])



    if (!data && !error) return <></>



    const onRoleUpdated = async (userId: string, newRole: string) => {
        const previousUsers = users.map(user => ({ ...user }))
        const updatedUser = users.map(user => ({
            ...user,
            role: userId === user.role ? newRole : user.role
        }));

        setUsers(updatedUser)
        try {
            await tesloApi.put('/admin/users', { userId, role: newRole })
        } catch (error) {
            setUsers(previousUsers)
            console.log(error)
            alert('No se pudo actualizar el error del usuario')
        }
    }

    return (
        <AdminLayout
            title="Usuarios"
            subTitle="Mantenimiento de usuarios"
            icon={<FiUsers />}
        >
            <Wrapper>
                <div>
                    <div> 
                        <span>Correo</span>
                        <span>Nombre Completo</span>
                        <span>Rol</span>
                    </div>
                    <div>
                        {users.map(user => (
                            
                            <div key={user._id}>
                                <span>{user.email}</span>
                                <span>{user.name}</span>
                                <select onChange={(e) => onRoleUpdated(user._id, e.target.value)}>
                                    <option value="">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</option>
                                    <option value='admin'>Admin</option>
                                    <option value='client'>Cliente</option>
                                    <option value='super-user'>Super-user</option>
                                    <option value="SEO">SEO</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            </Wrapper>
        </AdminLayout>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const { token = '' } = req.cookies
    let isValidToken = false
    let userId = ''

    try {
        userId = await jwt.isValidToken(token)
        isValidToken = true;
    } catch (error) {
        isValidToken = false
    }



    if (!isValidToken) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false,
            }
        }
    }

    await db.connect();
    const user = await User.findById(userId).lean();
    await db.disconnect();

    const validRoles = ['admin', 'super-user', 'SEO']
    if (!validRoles.includes(user!.role)) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }



    return {
        props: {

        }
    }
}

const Wrapper = styled.div`
    >div {
        border: 0.13rem solid var(--grey-color-40);
        border-radius: var(--border-radius);
        min-height: 70vh;
        > div:first-child {
            display: grid;
            grid-template-columns: minmax(150px, 350px) minmax(150px, 450px) minmax(150px, 580px);
            border-bottom: 0.13rem solid var(--grey-color-40);
            padding: 1rem;
        }
        > div:last-child {
            > div {
                display: grid;
                grid-template-columns: minmax(150px, 350px) minmax(150px, 450px) minmax(150px, 580px);
                border-bottom: 0.13rem solid var(--grey-color-40);
                    &:hover {
                        background-color: var(--grey-color-10);
                    }
                > span {
                    padding: 1rem;
                }
                 > select {
                    outline: none;
                    border: none;
                    width: 250px;
                    cursor: pointer;
                    background-color: transparent;
                 }   
            }
            
        }
    }
`

export default UserPage