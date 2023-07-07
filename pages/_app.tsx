import React, { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";

import { store } from "store/index";
import Layout from "components/layout";
import theme from "components/Theme";
import NotificationLaylout from "components/NotificationLaylout";
import DisabledShopAlert from "components/DisabledShopAlert";
import { AuthUserProvider } from "contexts/AuthUserContext";

import "styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import "moment/locale/fr";

import type { AppProps } from "next/app";

type PageWithLayout = NextPage & {
  title?: string;
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWhitLayout = AppProps & {
  Component: PageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWhitLayout) {
  const getLayout =
    Component.getLayout ??
    ((page) => <Layout title={Component.title}>{page}</Layout>);

  return (
    <AuthUserProvider>
      <Provider store={store}>
        {getLayout(
          <NotificationLaylout>
            <ThemeProvider theme={theme}>
              <DisabledShopAlert />
              <Component {...pageProps} />
            </ThemeProvider>
          </NotificationLaylout>
        )}
      </Provider>
    </AuthUserProvider>
  );
}

App.title = "Onliv'you";
