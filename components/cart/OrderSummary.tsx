import { useEffect, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { updateOrderSummary } from "../../store/features/cartSlice";
import { AppDispatch, RootState } from "../../store/store";
import { currency } from "../../utils";


interface Props {
    orderValues?: {
      numberOfItems: number;
      subTotal: number;
      total: number;
      tax: number;
    }
}

export const OrderSummary: FC<Props> = ({ orderValues }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {cart, numberOfItems, subTotal, tax, total} = useSelector((state: RootState) => state.cart);

  const summaryValues = orderValues ? orderValues : { numberOfItems, subTotal, tax, total};
 

  useEffect(() => {
    dispatch(updateOrderSummary())
  }, [dispatch, cart])

  return (
    <Wrapper>
      <div>
        <span>No. Productos</span>
        <span>SubTotal</span>
        <span>Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</span>
        <h3>Total:</h3> 
      </div>
      <div>
        <span>{summaryValues.numberOfItems} {summaryValues.numberOfItems > 1 ? 'productos' : 'producto'}</span>
        <span>{currency.format(summaryValues.subTotal)}</span>
        <span>{currency.format(summaryValues.tax)}</span>
        <h3>{currency.format(summaryValues.total)}</h3>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  > div {
    display: flex;
    flex-direction: column;
  }
  >div:first-child {
    
  }
  > div:last-child {
    align-items: end;
    h3 {
      font-weight: bold;
    }
  }
`;
