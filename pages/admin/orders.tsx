import React from 'react'
import { AdminLayout } from '../../components/layouts'
import { RiCoupon4Line } from 'react-icons/ri'
import styled from 'styled-components'
import useSWR from 'swr'
import { IOrder, IUser } from '../../interfaces'
import NextLink from 'next/link';
import { PaidOrder, UnpaidOrder } from '../orders/[id]'
import { GetServerSideProps } from 'next'
import { jwt } from '../../utils'
import { db } from '../../database'
import { User } from '../../models'

const OrdersPage = () => {

    const { data, error } = useSWR<IOrder[]>('/api/admin/orders')

    if(!data && !error) return <></>

    return (
        <AdminLayout
            title="Ordenes"
            subTitle="Mantenimiento de ordenes"
            icon={<RiCoupon4Line fontSize={33}
            />}>
            <Wrapper>
                <div>
                    <div>
                        <div>Order ID</div>
                        <div>Correo</div>
                        <div>Nombre Completo</div>
                        <div>Monto total</div>
                        <div>Pagada</div>
                        <div>No.Productos</div>
                        <div>Ver orden</div>
                        <div>Creada en:</div>
                    </div>
                    <div>
                        {
                            data?.map((order, index) => (
                                <div key={index}>
                                    <div>{order._id}</div>
                                    <div>{(order.user as IUser).email}</div>
                                    <div>{(order.user as IUser).name}</div>
                                    <div>${order.total}</div>
                                    <div>{order.isPaid ? <PaidOrder>Pagada</PaidOrder> : <UnpaidOrder>No pagada</UnpaidOrder>}</div>
                                    <div>{order.numberOfItems}</div>
                                    <NextLink href={`/admin/orders/${order._id}`} passHref>Ver orden</NextLink>
                                    <div>{order.createdAt}</div>
                                </div>
                            ))
                        }
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
    > div {
        border: 0.13rem solid var(--grey-color-40);
        border-radius: var(--border-radius);
        min-height: 70vh;
        width: 100%;
        overflow-x: scroll;
        > div:first-child {
            border-bottom: 0.13rem solid var(--grey-color-40);
            display: grid;
            grid-template-columns: repeat(8, calc(20% - 35px));
            padding: 1rem;
           
            
        }
        >div:last-child {
            > div {
                border-bottom: 0.13rem solid var(--grey-color-40);
            display: grid;
            grid-template-columns: repeat(8, calc(20% - 35px));
            padding: 1rem;
            > a {
                color: var(--black-color);
                font-weight: 500;
                &:hover {
                    text-decoration: underline;
                }
            }
            }
        }
    }
`

export default OrdersPage