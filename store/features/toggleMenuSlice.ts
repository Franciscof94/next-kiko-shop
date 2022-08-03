import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface ContextProps {
  toggleMenu: boolean
}

const initialState: ContextProps = {
    toggleMenu: false,
}

const toggleMenuSlice = createSlice({
  name: "toggleMenu",
  initialState,
  reducers: {
    toggleMenu(state, action: PayloadAction<boolean>) {
        state.toggleMenu = action.payload;
    },
  },
});

export const { toggleMenu } = toggleMenuSlice.actions;
export default toggleMenuSlice.reducer;