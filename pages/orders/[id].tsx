import { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { PayPalButtons } from "@paypal/react-paypal-js";
import styled from "styled-components";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import Screen from "../../styles/Screen";
import { MdOutlineCreditCardOff } from "react-icons/md";
import { IoBagCheckOutline } from "react-icons/io5";
import { jwt } from "../../utils";
import { dbOrders } from "../../database";
import { IOrder } from '../../interfaces/order';
import { tesloApi } from "../../api";


export type OrderResponseBody = {
  id: string;
  status:
  | "COMPLETED"
  | "SAVED"
  | "APPROVED"
  | "VOIDED"
  | "PAYER_ACTION_REQUIRED"
}

interface Props {
  order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const { shippingAddress } = order;

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== 'COMPLETED') {
      return alert('No hay pago en Paypal')
    }
    setIsPaying(true);
    try {
      const { data } = await tesloApi.post('/orders/pay', {
        transactionId: details.id,
        orderId: order._id,
      })

      router.reload()
    } catch (error) {
      setIsPaying(false);
      console.log(error)
      alert('No se pudo completar el pago')
    }
  }

  return (
    <ShopLayout
      title="Resumen de orden"
      pageDescription={"Resumen de la orden"}
    >
      <Wrapper>
        <div>
          <h1>Orden: {order._id}</h1>
          <div>
            {order.isPaid ? <PaidOrder>
              <IoBagCheckOutline fontSize={25} />
              <span>Orden ya fue pagada</span>
            </PaidOrder>
              :
              <UnpaidOrder>
                <MdOutlineCreditCardOff fontSize={25} />
                <span>Pendiente de pago</span>
              </UnpaidOrder>}
          </div>

          <CartList products={order.orderItems} />
        </div>

        <div>
          <h3>Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'producto' : 'productos'})</h3>
          <div>
            <h3>Dirección de entrega</h3>
            <span>{shippingAddress.name}</span>
            <span>{shippingAddress.address} {shippingAddress.address2 ? `, ${shippingAddress.address2}` : ''}</span>
            <span>{shippingAddress.city} {shippingAddress.zipCode}</span>
            <span>{shippingAddress.state}</span>
            <span>{shippingAddress.phone}</span>
          </div>
          <div>
            <OrderSummary orderValues={{
              numberOfItems: order.numberOfItems,
              total: order.total,
              subTotal: order.subTotal,
              tax: order.tax,
            }} />
          </div>
          {isPaying && <Loading />}
          {!isPaying && <div>
            {order.isPaid ? <PaidOrder>
              <IoBagCheckOutline fontSize={25} />
              <span>Orden ya fue pagada</span>
            </PaidOrder>
              :
              <PayPalButtons createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: `${order.total}`
                      },
                    },
                  ],
                });
              }}
                onApprove={(data, actions) => {
                  return actions.order!.capture().then((details) => {
                    onOrderCompleted(details)
                  });
                }} />

            }
          </div>}
        </div>
      </Wrapper>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

  const { id = "" } = query;
  const { token = '' } = req.cookies
  let isValidToken = false
  let user;

  try {
    user = await jwt.isValidToken(token)
    isValidToken = true;
  } catch (error) {
    isValidToken = false
  }

  if (!isValidToken) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      }
    }
  }

  const order = await dbOrders.getOrderById(id.toString())

  if (!order) {
    return {
      redirect: {
        destination: '`/orders/history`',
        permanent: false,
      }
    }
  }

  if (order.user !== user) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      }
    }
  }


  return {
    props: {
      order
    }
  }
}

const Wrapper = styled.div`
  display: grid;
  grid-template-row: 60% 40%;
  ${Screen.md`
  grid-template-columns: 60% 40%;
  `}
  > div:first-child {
    > h1 {
      font-size: 1.8em;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    > div:nth-child(2) {
    }
  }
  > div:last-child {
    border: 0.12rem solid var(--grey-color-10);
    width: 100%;
    padding: 1rem;
    height: fit-content;
    border-radius: var(--border-radius);
    box-shadow: 1px 4px 6px rgba(0, 0, 0, 0.3);
    h2 {
      font-weight: 500;
      padding-bottom: 0.5rem;
      border-bottom: 0.15rem solid var(--grey-color-10);
      margin-bottom: 0.6rem;
    }
    > div:nth-child(2) {
      h3 {
        margin: 0 0 0.5rem 0;
      }
      display: flex;
      flex-direction: column;
      border-bottom: 0.15rem solid var(--grey-color-10);
      margin-bottom: 0.8rem;
      padding-bottom: 0.6rem;
    }
    > div:nth-child(3) {
      a {
        color: var(--blue-color);
        text-decoration: underline;
      }
    }
    h3 {
      font-weight: 500;
      margin: 0.8rem 0 1rem 0;
    }
  }
`;

export const PaidOrder = styled.div`
  color: var(--green-color);
  padding: 0.2rem 0.5rem;
  border: 0.12rem solid var(--green-color);
  border-radius: 25px;
  width: fit-content;
  display: flex;
  align-items: center;
 /*  margin-bottom: 0.8rem; */
`;

export const UnpaidOrder = styled.div`
  color: var(--red-color);
  padding: 0.2rem 0.5rem;
  border: 0.12rem solid var(--red-color);
  border-radius: 25px;
  width: fit-content;
  display: flex;
  align-items: center;
  /* margin-bottom: 0.8rem; */
`;

export const Loading = styled.div`
  border: 4px solid var(--blue-color);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border-left-color: transparent;
  animation: spin 1s linear infinite;
  margin: 0 auto;
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`

export default OrderPage;
