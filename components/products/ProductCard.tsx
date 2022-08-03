import { FC, useMemo, useState } from "react";
import Image from "next/image";
import NextLink from "next/link";

import styled from "styled-components";
import { IProduct } from "../../interfaces";

interface Props {
  product: IProduct;
}

export const ProductCard: FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const productImage = useMemo(() => {
    return isHovered
      ? `/products/${product.images[1]}`
      : `/products/${product.images[0]}`;
  }, [isHovered, product.images]);

  return (
    <Wrapper
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NextLink href={`/products/${product.slug}`} passHref prefetch={false}>
        <div key={product.slug} className="unset-img">
          {
            product.inStock === 0 && <NotAvaible>No hay disponibles</NotAvaible>
          }
          <Image
          className="image"
            layout="fill"
        
            src={productImage}
            alt={product.title}
          />
        </div>
      </NextLink>
      <div>
        <h4>{product.title}</h4>
        <h4>{`$${product.price}`}</h4>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  > div {
    position: relative;
    > span {
      border-radius: var(--border-radius);
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
    
  }
  > div:last-child {
    margin-top: 1rem;
    h4:last-child {
      font-weight: 500;
    }
  }
  .unset-img {
    width: 100%;
  
    > span {
      position: unset !important;
    }
  
    .image {
      object-fit: contain;
      width: 100% !important;
      position: relative !important;
      height: unset !important;
    }
  }
`;

const NotAvaible = styled.div`
  background-color: var(--black-color);
  padding: 0.3rem 0.9rem;
  color: white;
  border-radius: 25px;
  position: absolute;
  z-index: 1;
  margin: 1rem;
`
