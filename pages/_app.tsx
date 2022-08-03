import React, { useEffect } from "react";
import { Provider } from 'react-redux';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { AppProps } from "next/app";
import GlobalStyle from "../styles/global";
import { ThemeProvider } from "styled-components";

import { SWRConfig } from "swr";
import darkTheme from "../styles/lightTheme";
import { store } from "../store/store";


const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {

  return (
    <Provider store={store}>
      <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT || '' }}>
        <SWRConfig
          value={{
            fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
          }}
        >
          <ThemeProvider theme={darkTheme}>
            <Component {...pageProps} />
            <GlobalStyle />
          </ThemeProvider>
        </SWRConfig>
      </PayPalScriptProvider>
    </Provider>
  );
};

export default MyApp;
