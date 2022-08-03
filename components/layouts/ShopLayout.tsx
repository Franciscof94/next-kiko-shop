import { FC } from "react";

import Head from "next/head";
import styled from "styled-components";
import { Navbar, SideMenu } from "../ui";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";


interface Props {
  children: any;
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}

export const ShopLayout: FC<Props> = ({
  children,
  title,
  pageDescription,
  imageFullUrl,
}) => {
  const openMenu = useSelector((state: RootState) => state.toggleMenu.toggleMenu);
  return (
    <>
      {openMenu && <div style={{ position: 'absolute', transition: 'all 0.5s', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: "blur(8px)", width: '100%', zIndex: 15566 }}></div>}
      <Head>
        <title>{title}</title>

        <meta name="description" content={pageDescription} />

        <meta name="og:title" content={title} />
        <meta name="og:description" content={pageDescription} />

        {imageFullUrl && <meta name="og:image" content={imageFullUrl} />}
      </Head>

      <nav
        style={{
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Navbar />
      </nav>

      <SideMenu />

      <main
        style={{
          margin: "30px auto",
          maxWidth: "1440px",
          padding: "0px 30px",
        }}
      >
        {children}
      </main>

      <footer>{/* TODO: mi custom footer */}</footer>
    </>
  );
};

