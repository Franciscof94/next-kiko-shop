import { useEffect, useState } from 'react';
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { AppDispatch, RootState } from "../../store/store";
import Screen from "../../styles/Screen";
import { jwt } from "../../utils";
import { createOrder, loadAddressFromCookie, orderComplete } from "../../store/features/cartSlice";
import Cookies from 'js-cookie';
import { ButtonDisabled } from '../products/[slug]';
import { ButtonPrimary } from '../../share/Button';


interface Styled {
  isPosting: boolean
}

const SummaryPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { cart, shippingAddress, numberOfItems, message, hasError } = useSelector((state: RootState) => state.cart);
  const [isPosting, setIsPosting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')



  useEffect(() => {
    dispatch(loadAddressFromCookie())
  }, [dispatch])

  useEffect(() => {
    if (!hasError && isPosting && message) {
      dispatch(orderComplete())
      router.push(`/orders/${message}`)
      return
    }
  }, [dispatch, hasError, isPosting, message, router])

  if (!shippingAddress) {
    return <></>
  }



  if (isPosting && hasError) {
    setIsPosting(false)
    setErrorMessage(message)
  }

  const { name, lastName, address, address2 = '', zipCode, phone, city, state } = shippingAddress;

  const onCreateOrder = () => {
    setIsPosting(true)

    dispatch(createOrder())
  }

  return (
    <ShopLayout
      title="Resumen de orden"
      pageDescription={"Resumen de la orden"}
    >
      <Wrapper isPosting={isPosting}>
        <div>
          <h1>Resumen de la orden</h1>
          <CartList />
        </div>

        <div>
          <h3>Resumen ({numberOfItems} {numberOfItems === 1 ? 'producto' : 'productos'})</h3>
          <div>
            <NextLink href="/checkout/address" passHref>
              Editar
            </NextLink>
          </div>
          <div>
            <h3>Dirección de entrega</h3>
            <span>{name} {lastName}</span>
            <span>{address} {address2 ? `, ${address2}` : ''}</span>
            <span>{city}, {zipCode}</span>
            <span>{state}</span>
            <span>{phone}</span>
          </div>
          <div>
            <NextLink href="/cart" passHref>
              Editar
            </NextLink>
          </div>

          <div>
            <OrderSummary />
          </div>
          <ButtonPrimary disabled={isPosting} onClick={() => onCreateOrder()}>Confirmar orden</ButtonPrimary>
          {hasError && <ButtonDisabled>{errorMessage}</ButtonDisabled>}
        </div>
      </Wrapper>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token = '' } = req.cookies
  let isValidToken = false

  try {
    await jwt.isValidToken(token)
    isValidToken = true;
  } catch (error) {
    isValidToken = false
  }

  if (!isValidToken) {
    return {
      redirect: {
        destination: '/auth/login?p=/checkout/summary',
        permanent: false,
      }
    }
  }

  return {
    props: {

    }
  }
}

const Wrapper = styled.div<Styled>`
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
  }
  > div:last-child {
    border: 0.12rem solid var(--grey-color-10);
    width: 100%;
    padding: 1rem;
    height: fit-content;
    border-radius: var(--border-radius);
    box-shadow: 1px 4px 6px rgba(0, 0, 0, 0.3);
    margin-bottom: 1.8rem;
    h2 {
      font-weight: 500;
      padding-bottom: 0.5rem;
      border-bottom: 0.15rem solid var(--grey-color-10);
      margin-bottom: 0.6rem;
    }
    div:nth-child(2) {
      display: flex;
      justify-content: end;
      border-top: 0.15rem solid var(--grey-color-10);
      a {
        text-decoration: underline;
        color: var(--blue-color);
      }
    }
    > div:nth-child(3) {
      h3 {
        margin: 0 0 0.5rem 0;
      }
      display: flex;
      flex-direction: column;
      border-bottom: 0.15rem solid var(--grey-color-10);
      margin-bottom: 0.8rem;
      padding-bottom: 0.6rem;
    }
    > div:nth-child(4) {
      display: flex;
      justify-content: end;
      a {
        color: var(--blue-color);
        text-decoration: underline;
      }
    }
    h3 {
      font-weight: 500;
      margin: 0.8rem 0 1rem 0;
    }
    button {
      cursor: ${props => props.isPosting ? 'not-allowed' : 'pointer'};
      background-color: ${props => props.isPosting ? 'var(--grey-color-10)' : 'var(--blue-color)'};
      color: ${props => props.isPosting ? 'var(--grey-color-40)' : 'white'};
    }
  }
`;

export default SummaryPage;
