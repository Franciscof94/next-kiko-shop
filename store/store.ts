import {
    Action,
    configureStore,
    ThunkAction,
  } from '@reduxjs/toolkit';
  import toggleMenu from './features/toggleMenuSlice';
  import cart from './features/cartSlice';
  import authUser from './features/authSlice';
  
  export const store = configureStore({
    reducer: { 
      toggleMenu,
      cart,
      authUser
  } 
    
  });
  
  export type AppDispatch = typeof store.dispatch;
  export type RootState = ReturnType<typeof store.getState>;
  export type AppThunk<ReturnType = void> = ThunkAction<
     ReturnType,
     RootState,
     unknown,
     Action<string>
   >;
  export type AppState = ReturnType<typeof store.getState>;