import { FC } from "react";
import styled from "styled-components";
import { IProduct } from "../../interfaces";
import { ProductCard } from "./ProductCard";

interface Props {
  products: IProduct[];
}

export const ProductList: FC<Props> = ({ products }) => {
  return (
    <Wrapper>
      {products.map((product) => (
        <ProductCard product={product} key={product.slug} />
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  
  grid-gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
`;
