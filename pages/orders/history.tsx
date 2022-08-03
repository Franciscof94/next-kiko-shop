import { FC } from "react";
import { GetServerSideProps } from "next";
import styled from "styled-components";
import { ShopLayout } from "../../components/layouts";
import { dbOrders } from "../../database";
import { IOrder } from "../../interfaces";
import { jwt } from "../../utils";
import { PaidOrder, UnpaidOrder } from "./[id]";
import NextLink from 'next/link';


interface Props {
  orders: IOrder[]
}

const HistoryPage:FC<Props> = ({ orders }) => {

  return (
    <ShopLayout
      title={"Historial de ordenes"}
      pageDescription={"Historial de ordenes del cliente"}
    >
      <h1>Historial de ordenes</h1>
      <Wrapper>
        <div>
          <div>ID</div>
          <div>Nombre Completo</div>
          <div>Pagada</div>
          <div>Ver orden</div>
        </div>
        <div>
        {orders.map((row, index) => (
          <div key={row._id}>
            <div>{index +1}</div>
            <div>{row.shippingAddress.name} {row.shippingAddress.lastName}</div>
            <div>
              {row.isPaid ? (
                <PaidOrder>Orden ya fue pagada</PaidOrder>
              ) : (
                <UnpaidOrder>Pendiente de pago</UnpaidOrder>
              )}
            </div>
            <NextLink href={`/orders/${row._id}`} passHref>Ver orden</NextLink>
          </div>
        ))}
        </div>
      </Wrapper>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token = '' } = req.cookies
  let user;

  try {
    user = await jwt.isValidToken(token);
  } catch (error) {
    console.log(error)
  }

  if(!user) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/history`,
        permanent: false,
      }
    }
  }

    const orders = await dbOrders.getOrdersByUser(user);

  return {
    props: {
      orders
    }
  }
}

const Wrapper = styled.div`
  border: 0.13rem solid var(--grey-color-40);
  border-radius: var(--border-radius);
  min-height: 70vh;
  > div:first-child {
    display: grid;
    grid-template-columns:
      minmax(80px, 150px) minmax(150px, 310px) minmax(150px, 350px)
      minmax(150px, 570px);
    border-bottom: 0.13rem solid var(--grey-color-40);
    padding: 1rem;
    font-weight: 500;
    > div:not(:last-child) {
      border-right: 0.13rem solid var(--grey-color-40);
      margin-right: 0.5rem;
    }
   
  }
  > div:last-child {
   > div {
    display: grid;
    align-items: center;
    padding: 0.6rem 0 0.6rem 1rem;
    grid-template-columns:
      minmax(80px, 150px) minmax(150px, 310px) minmax(150px, 350px)
      minmax(150px, 570px);
      border-bottom: 0.13rem solid var(--grey-color-40);
      transition: var(--main-transition);
      &:hover {
        background-color: var(--grey-color-10);
      }
      >a:last-child {
        cursor: pointer;
        color: var(--black-color);
        &:hover {
          text-decoration: underline;
        }
      }
   }
  }
  
`;

export default HistoryPage;
