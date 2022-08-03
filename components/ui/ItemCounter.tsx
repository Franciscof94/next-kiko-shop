import { FC } from "react";
import styled from "styled-components";

import { CgAdd, CgRemove } from "react-icons/cg";

interface Props {
  currentValue: number;
  maxValue: number;
  updateQuantity: (newValue: number) => void;
}


export const ItemCounter: FC<Props> = ({ currentValue, updateQuantity, maxValue }) => {


  const addOrRemove = ( value: number ) => {
    if ( value === -1 ) {
      if ( currentValue === 1 ) return;

      return updateQuantity( currentValue - 1);
    }

    if ( currentValue >= maxValue ) return;

    updateQuantity( currentValue + 1 );
  }

    return (
      <Wrapper>
        <div onClick={() => addOrRemove(-1)}>
          <CgRemove fontSize={25} color="#676767" />
        </div>
        <span>{currentValue}</span>
        <div onClick={() => addOrRemove(+1)}>
          <CgAdd fontSize={25} color="#676767" />
        </div>
      </Wrapper>
    );
  };

  const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  > span {
    margin: 0 1.4rem;
    color: var(--grey-color-50);
    font-weight: 500;
  }
  > div {
    cursor: pointer;
  }
`;


