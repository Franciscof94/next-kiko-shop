import styled from "styled-components";

export const FullScreenLoading = () => {
  return (
    <Wrapper>
      <h2>Cargando...</h2>
      <div></div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  height: calc(100vh - 200px);
  align-items: center;
  flex-direction: column;
  > h2 {
    font-weight: 500;
    margin-bottom: 1rem;
  }
  > div {
    border: 4px solid var(--blue-color);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border-left-color: transparent;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
