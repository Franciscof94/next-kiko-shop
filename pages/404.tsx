import styled from "styled-components";

import { ShopLayout } from "../components/layouts";
import Screen from "../styles/Screen";

const Custom404 = () => {
  return (
    <ShopLayout
      title="Page not found"
      pageDescription="No hay nada que mostrar aqui"
    >
      <Wrapper>
        <div>
          <h1>404 |</h1>
          <h4>No encontramos ninguna página aquí</h4>
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
  > div {
    display: flex;
    align-items: center;
    flex-direction: column;
    ${Screen.sm`
        flex-direction: row;
    `}
    > h4 {
      margin-left: 1rem;
    }
  }
`;

export default Custom404;
