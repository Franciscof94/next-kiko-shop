import { FC } from "react";

import styled from "styled-components";
import { ISize } from "../../interfaces";
import Screen from "../../styles/Screen";

interface Props {
  selectedSize?: ISize;
  sizes: ISize[];
  onSelectedSize: (size: ISize) => void;
}

export const SizeSelector: FC<Props> = ({ selectedSize, sizes, onSelectedSize }) => {

    

  return (
    <Wrapper>
      {sizes.map((size) => (
        <div onClick={() => onSelectedSize(size)} style={{ backgroundColor: selectedSize === size ? "var(--black-color)" : 'transparent', color: selectedSize === size ? 'white' : 'var(--black-color)'}} key={size}>
          {size}
        </div>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    > div {
        margin: 0.5rem;
        ${Screen.md`
        margin: 0.5rem 1rem;
        `}
        padding: 0.5rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-weight: 500;
        &:hover {
            background-color: var(--grey-color-10);
        }
    }
`;
