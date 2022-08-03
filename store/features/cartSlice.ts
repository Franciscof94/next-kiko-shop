import {
  createSlice,
  PayloadAction,
  current,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { ICartProduct } from "../../interfaces/cart";
import Cookie from "js-cookie";
import Cookies from "js-cookie";
import { tesloApi } from "../../api";
import { IOrder } from "../../interfaces";
import { AppState } from "../store";
import axios from "axios";

interface ContextProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
  hasError: boolean,
  message: string
}

interface ShippingAddress {
  name: string;
  lastName: string;
  address: string;
  address2: string;
  zipCode: string;
  phone: string;
  city: string;
  state: string;
}

const initialState: ContextProps = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
  hasError: false,
  message: "" 
};

export const createOrder = createAsyncThunk("cart/createOrder", async (_, api) => {
  const { cart } = api.getState() as AppState
  const { shippingAddress, numberOfItems, subTotal, tax, total, hasError } = cart
 if(!shippingAddress) {
  throw new Error("No se ha definido la dirección de envío")
 }

 const body: IOrder = {
  orderItems: cart.cart.map(p => ({
    ...p,
    size: p.size!
  })),
  shippingAddress: shippingAddress,
  numberOfItems: numberOfItems,
  subTotal: subTotal,
  tax: tax,
  total: total,
  isPaid: false
}

  try {
    const { data } = await tesloApi.post<IOrder>("/orders", body);


    return api.fulfillWithValue(data._id!)

    
  } catch (error) {
    if(axios.isAxiosError(error)) {
      return api.rejectWithValue('Error al crear la orden')
      
    }
  }
});

const cartSlice = createSlice({
  name: "cartProducts",
  initialState,
  reducers: {
    cart: (state, action: PayloadAction<ICartProduct>) => {
      const productInCart = state.cart.some(
        (p) => p._id === action.payload._id
      );
      if (!productInCart) {
        state.cart = [...state.cart, action.payload];
      }
      const productInCartButDifferentSize = state.cart.some(
        (product) =>
          product._id === action.payload._id &&
          product.size === action.payload.size
      );
      if (!productInCartButDifferentSize) {
        state.cart = [...state.cart, action.payload];
      }

      const updateProducts = state.cart.map((product) => {
        if (product._id !== action.payload._id) return product;
        if (product.size !== action.payload.size) return product;
        product.quantity += action.payload.quantity;
        return product;
      });
      state.cart = updateProducts;
    },
    updateProductsInCart: (state) => {
      Cookie.set("cart", JSON.stringify(current(state.cart)));
      state.isLoaded = true;
    },
    addCookiesProductsToCart: (
      state,
      action: PayloadAction<ICartProduct[]>
    ) => {
      console.log(action.payload);
      state.cart = action.payload;
    },
    updateCartQuantity: (state, action: PayloadAction<ICartProduct>) => {
      state.cart = state.cart.map((product) => {
        if (product._id !== action.payload._id) return product;
        if (product.size !== action.payload.size) return product;
        return action.payload;
      });
    },
    removeCartProduct: (state, action: PayloadAction<ICartProduct>) => {
      state.isLoaded = state.cart.length === 0 && false;
      state.cart = current(state.cart).filter(
        (item: any) =>
          !(
            item._id === action.payload._id && item.size === action.payload.size
          )
      );
    },
    updateOrderSummary: (state) => {
      const numberOfItems = current(state.cart).reduce(
        (prev, current) => current.quantity + prev,
        0
      );
      const subTotal = current(state.cart).reduce(
        (prev, current) => current.price * current.quantity + prev,
        0
      );
      const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

      const orderSummary = {
        numberOfItems,
        subTotal,
        tax: subTotal * taxRate,
        total: subTotal * (taxRate + 1),
      };
      return {
        ...state,
        ...orderSummary,
      };
    },
    loadAddressFromCookie: (state) => {
      const shippingAddress = {
        name: Cookies.get("name") || "",
        lastName: Cookies.get("lastName") || "",
        address: Cookies.get("address") || "",
        address2: Cookies.get("address2") || "",
        zipCode: Cookies.get("zipCode") || "",
        phone: Cookies.get("phone") || "",
        city: Cookies.get("city") || "",
        state: Cookies.get("state") || "",
      };
      state.shippingAddress = shippingAddress;
    },
    orderComplete: (state) => {
      state.cart = [];
      state.numberOfItems = 0;
      state.subTotal = 0;
      state.tax = 0;
      state.total = 0;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.fulfilled, (state, { payload }: any) => {
      state.message = payload,
      state.hasError = false

    });
    builder.addCase(createOrder.rejected, (state, {payload}: any) => {
      state.message = payload,
      state.hasError = true
    });
  }

});

export const {
  cart,
  updateProductsInCart,
  updateCartQuantity,
  removeCartProduct,
  addCookiesProductsToCart,
  updateOrderSummary,
  loadAddressFromCookie,
  orderComplete,
} = cartSlice.actions;
export default cartSlice.reducer;
