import NextLink from 'next/link';
import styled from "styled-components";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { ShopLayout } from "../../components/layouts";


const EmptyPage = () => {
  return (
    <ShopLayout
      title="Carrito vació"
      pageDescription="No hay articulos en el carrito de compras"
    >
      <Wrapper>
        <MdOutlineRemoveShoppingCart fontSize={85} />
        <div>
          <h3>Su carrito esta vació</h3>
          <NextLink href="/" passHref>
            <h2>Regresar</h2>
          </NextLink>
        </div>
      </Wrapper>
    </ShopLayout>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  height: calc(100vh - 200px);
  align-items: center;
  > div:last-child {
    display: flex;
    align-items: start;
    flex-direction: column;
    margin-left: 1rem;
    > h3 {
      
      font-weight: 500;
    }
    > h2 {
        cursor: pointer;
        color: var(--blue-color);
        font-weight: 400;
    }
  }
`;

export default EmptyPage;
