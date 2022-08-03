import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import NextLink from "next/link";
import styled from "styled-components";
import { AppDispatch, RootState } from "../../store/store";
import { ItemCounter } from "../ui";
import { removeCartProduct, updateCartQuantity, addCookiesProductsToCart, updateProductsInCart } from "../../store/features/cartSlice";
import { ICartProduct, IOrderItem } from "../../interfaces";
import Cookies from "js-cookie";
import Screen from "../../styles/Screen";
import useWindowDimensions from "../../hooks/useResize";

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { cart, shippingAddress } = useSelector((state: RootState) => state.cart);

  const { width } = useWindowDimensions();

  const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
    dispatch(updateCartQuantity({ ...product, quantity: newQuantityValue }));
  }

  useEffect(() => {
    const cookieProducts = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")!) : [];

    dispatch(addCookiesProductsToCart(cookieProducts))
  }, [dispatch])

  useEffect(() => {

    dispatch(updateProductsInCart())
  }, [dispatch, cart])


  const productsToShow = products ? products : cart;

  return (
    <Wrapper>
      {productsToShow.map((product) => (
        <div key={product.slug + product.size}>
          <div>
            <div>
              <NextLink href={`/products/${product.slug}`} passHref>
                <Image
                  width={width!! <= 768 ? 90 : 170}
                  height={width!! <= 768 ? 90 : 170}
                  src={`/products/${product.image}`}
                  alt="product"
                  objectFit="cover"
                />
              </NextLink>
            </div>
            <div>
              <h3>{product.title}</h3>
              <h3>
                Talla: <strong>{product.size}</strong>
              </h3>
              {editable ? <ItemCounter currentValue={product.quantity} maxValue={10} updateQuantity={(value) => onNewCartQuantityValue(product as ICartProduct, value)} /> : <h5>{product.quantity} {product.quantity > 1 ? 'productos' : 'producto'}</h5>}
            </div>
          </div>
          <div>
            <h3>{`$${product.price}`}</h3>
            {editable && <button onClick={() => dispatch(removeCartProduct(product as ICartProduct))}>Remover</button>}
          </div>
        </div>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  > div {
    display: flex;
    justify-content: space-between;
    
    margin-bottom: 1.5rem;
    ${Screen.md`
        margin: 0;
    `} 
    > div:first-child {
      display: flex;
      margin-left: 0;
     
      ${Screen.md`
      margin-left: 1rem;
      `}
      > div:last-child {
        margin-left: .5rem;
        ${Screen.md`
          margin-left: 1.3rem;
        `}
        h3 {
          font-weight: 500;
          margin-bottom: 0.3rem;
        }
      }
    }
    > div:last-child {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0;
      ${Screen.md`
        margin-right: 1.4rem;
      `}
      button {
        background-color: transparent;
        outline: none;
        border: none;
        color: var(--blue-color);
        font-weight: 600;
        font-size: 0.9em;
        cursor: pointer;
        padding: 0.4rem;
        border-radius: var(--border-radius);
        border: 0.1rem solid var(--blue-color);
        transition: var(--main-transition);
        &:hover {
          background-color: var(--blue-color);
          color: white;
        }
      }
    }
  }
`;
