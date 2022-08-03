import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import  NextLink  from "next/link";
import styled from "styled-components";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import {ButtonPrimary } from "../../share/Button";
import { AppDispatch, RootState } from "../../store/store";
import { addCookiesProductsToCart, updateProductsInCart } from "../../store/features/cartSlice";
import Screen from "../../styles/Screen";
import Cookies from "js-cookie";


const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cart, isLoaded } = useSelector((state: RootState) => state.cart);
  const router = useRouter();

  
  useEffect(() => {

    dispatch(updateProductsInCart())
  }, [dispatch, cart]) 



  useEffect(() => {
    if ( isLoaded && cart.length === 0 ){
      router.replace('/cart/empty');
    }
  }, [ isLoaded, cart, router ])
  
  if ( !isLoaded || cart.length === 0 ) {
      return (<></>);
  }


  return (
    <ShopLayout
      title={`Carrito - ${cart.length} productos`}
      pageDescription={"Carrito de compras de la tienda"}
    >
      <Wrapper>
        <div>
          <h1>Carrito</h1>
          <CartList editable />
        </div>

        <div>
          <h2>Orden</h2>
          <div>
            <OrderSummary />
          </div>
          <NextLink href="/checkout/address" passHref><ButtonPrimary>Checkout</ButtonPrimary></NextLink>
        </div>
      </Wrapper>
    </ShopLayout>
  );
};



const Wrapper = styled.div`
  display: grid;
  grid-template-columns: none;
  margin-top: 2rem;
  ${Screen.md`
    grid-template-columns: 60% 40%;
  `}
  > div:first-child {
    > h1 {
        font-size: 1.9em;
        font-weight: 600;
    }
  }
  > div:last-child {
    width: 100%;
    padding: 1rem;
    height: fit-content;
    border-radius: var(--border-radius);
    box-shadow: 1px 4px 6px rgba(0, 0, 0, 0.3);
    margin: 1.8rem 0;
    ${Screen.md`
    margin: 0;
    `}
    h2 {
        font-weight: 500;
        padding-bottom: 0.5rem;
        border-bottom: 0.15rem solid var(--grey-color-10);
        margin-bottom: 0.6rem;
    }
    h3 {
      font-weight: 500;
      margin: 0.8rem 0 1.8rem 0;
    }
  }
`;

export default CartPage;
