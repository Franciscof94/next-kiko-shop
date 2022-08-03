import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetServerSideProps, GetStaticPaths, NextPage } from "next";
import { useRouter } from "next/router";
import styled from "styled-components";
import { ShopLayout } from "../../components/layouts";
import { ButtonPrimary } from "../../share/Button";
import { ProductSlideshow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { ICartProduct, IProduct, ISize } from "../../interfaces";
import { dbProducts } from "../../database";
import { AppDispatch, RootState } from "../../store/store";
import { cart, updateProductsInCart } from "../../store/features/cartSlice";
import Screen from "../../styles/Screen";





interface Props {
  product: IProduct;
}

type StylesProps = {
  changeButton: boolean
}

const ProductPage: NextPage<Props> = ({ product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const productInCart = useSelector((state: RootState) => state.cart.cart);


  const router = useRouter()

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1
  });

  let changeButton = product.inStock === 0 ? true : false;

  const selectedSize = (size: ISize) => {
    setTempCartProduct(currentProduct => ({
      ...currentProduct,
      size,
    }))
  }

  const selectedQuantity = (quantity: number) => {
    setTempCartProduct(currentProduct => ({
      ...currentProduct,
      quantity,
    }))
  }

  const onAddProduct = () => {
    dispatch(cart(tempCartProduct))
    router.push('/cart');
  }


  useEffect(() => {

    dispatch(updateProductsInCart())
  }, [dispatch, productInCart])




  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Wrapper changeButton={changeButton}>
        <div>
          <ProductSlideshow images={product.images} />
        </div>
        <div>
          <h1>{product.title}</h1>
          <h2>${product.price}</h2>
          <div>
            <span>Cantidad</span>
            <ItemCounter
              currentValue={tempCartProduct.quantity}
              updateQuantity={selectedQuantity}
              maxValue={product.inStock > 10 ? 10 : product.inStock}
            />
            <SizeSelector
              selectedSize={tempCartProduct.size}
              sizes={product.sizes}
              onSelectedSize={selectedSize}
            />
          </div>
          {changeButton ? <ButtonDisabled>No hay disponibles</ButtonDisabled> :
            <ButtonPrimary onClick={onAddProduct} disabled={changeButton}>{tempCartProduct.size ? 'Agregar al carrito' : 'Seleccione una talla'}</ButtonPrimary>}
          <span>Descripción</span>
          <p>{product.description}</p>
        </div>
      </Wrapper>
    </ShopLayout>
  );
};



export const getStaticPaths: GetStaticPaths = async () => {
  const productSlug = await dbProducts.getAllProductSlug();

  return {
    paths: productSlug.map(({ slug }) => ({
      params: {
        slug
      }
    })),
    fallback: 'blocking'
  };
}

export const getStaticProps: GetServerSideProps = async ({ params }) => {

  const { slug = '' } = params as { slug: string };
  const product = await dbProducts.getProductsBySlug(slug);


  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 86400
  }
}

const Wrapper = styled.div<StylesProps>`
  
 
  ${Screen.md`
  grid-template-columns: 65% 35%;
  display: grid;
  `}

  > div:first-child {
    width: 100%;
    height: 100%;
    min-width: 20px;
    
    ${Screen.md`
    margin: 1rem;
    max-width: 850px
    `}
  }
  > div:last-child {
    
    padding: 0 1rem;
    margin-bottom: 2rem;
    ${Screen.md`
    
    max-width: 470px;
    `}
    > h1 {
      font-size: 2em;
      font-weight: 500;
      line-height: 1.2;
      margin-top: 1rem;
    }
    > h2 {
      font-weight: 400;
    }
    > div:nth-child(3) {
      span {
        font-weight: 500;
      }
    }
    > span {
      font-weight: 500;
    }
    > button {
      margin: 0.9rem 0;
      cursor: ${props => props.changeButton ? 'not-allowed' : 'pointer'};
      pointer-events: ${props => props.changeButton ? 'all !important' : 'auto'};
    }
    > p {
      font-size: 1em;
      margin-bottom: 1rem;
    }
    > div:nth-child(3) {
      margin: 0.9rem 0;
    }
  }
`;

export const ButtonDisabled = styled.div`
color: var(--red-color);
height: 38px;
width: 100%;
font-size: 1.1em;
border-radius: 25px;
border: 0.13rem solid var(--red-color);
display: flex;
align-items: center;
justify-content: center;
margin: 0.9rem 0;
`

export default ProductPage;
