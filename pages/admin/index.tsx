import React, { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/layouts'
import styled from 'styled-components'
import { MdOutlineDashboard, MdPaid, MdOutlineCreditCardOff, MdCancelPresentation, MdProductionQuantityLimits } from 'react-icons/md'
import SummaryTile from '../../components/admin/SummaryTile'
import { IoMdCard } from 'react-icons/io'
import { FiUsers } from 'react-icons/fi'
import { FaShapes } from 'react-icons/fa'
import { BiTimeFive } from 'react-icons/bi'
import useSWR from 'swr'
import { DashboardSummaryResponse } from '../../interfaces'
import { GetServerSideProps } from 'next'
import { jwt } from '../../utils'
import { db } from '../../database'
import { User } from '../../models'

const DashboardPage = () => {

    const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30 * 1000,
    })

    const [refreshIn, setRefreshIn] = useState(30)

    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30)
        }, 1000)
        return () => clearInterval(interval)
    }, [refreshIn])

    if (!error && !data) {
        return <></>
    }

    if (error) {
        console.error(error)
        return <h3>Error al cargar la información</h3>
    }

    const {
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        notPaidOrders
    } = data!

    return (
        <AdminLayout
            title="Dashboard"
            subTitle="Estadisticas generales"
            icon={<MdOutlineDashboard />}
        >
            <Wrapper>
                <SummaryTile
                    title={numberOfOrders}
                    subTitle="Ordenes totales"
                    icon={<IoMdCard color="var(--blue-color)" fontSize={38} />}
                />
                <SummaryTile
                    title={paidOrders}
                    subTitle="Ordenes pagadas"
                    icon={<MdPaid color="#348434" fontSize={38} />}
                />
                <SummaryTile
                    title={notPaidOrders}
                    subTitle="Ordenes pendientes"
                    icon={<MdOutlineCreditCardOff color="var(--red-color)" fontSize={38} />}
                />
                <SummaryTile
                    title={numberOfClients}
                    subTitle="Clientes"
                    icon={<FiUsers fontSize={38} />}
                />
                <SummaryTile
                    title={numberOfProducts}
                    subTitle="Productos"
                    icon={<FaShapes color="#d48920" fontSize={38} />}
                />
                <SummaryTile
                    title={productsWithNoInventory}
                    subTitle="Sin existencias"
                    icon={<MdCancelPresentation color="var(--red-color)" fontSize={38} />}
                />
                <SummaryTile
                    title={lowInventory}
                    subTitle="Bajo inventario"
                    icon={<MdProductionQuantityLimits color="#d48920" fontSize={38} />}
                />
                <SummaryTile
                    title={refreshIn}
                    subTitle="Actualización en:"
                    icon={<BiTimeFive color="var(--blue-color)" fontSize={38} />}
                />
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
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    grid-gap: 1.2rem;
`

export default DashboardPage