import styled, { css } from "styled-components";

interface Props {
  bgColor?: boolean;
}


export const ButtonPrimary = styled.button`
  outline: none;
  border: none;
  cursor: pointer;
  background-color: transparent;
  font-family: "Poppins", sans-serif;
  width: 100%;
  background-color: var(--blue-color);
  height: 38px;
  color: white;
  font-size: 1.1em;
  border-radius: 25px;
`;

export const ButtonSecondary = styled.button<Props>`
  outline: none;
  border: none;
  cursor: pointer;
  background-color: transparent;
  font-family: "Poppins", sans-serif;
  color: var(--black-color);
  padding: 0.5rem 1rem;
  transition: var(--main-transition);
  font-weight: 500;
  font-size: 1.1em;
  background-color: ${(props) => props.bgColor && "var(--black-color)"};
  color: ${(props) => props.bgColor && "white"};
  border-radius: var(--border-radius);
  &:hover {
    background-color: ${(props) =>
      props.bgColor ? "black" : "var(--grey-color-10)"};
  }
`;
