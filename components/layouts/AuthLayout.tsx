import Head from "next/head";
import { FC } from "react";

interface Props {
  children: any;
  title: string;
}

export const AuthLayout: FC<Props> = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 200px)",
          }}
        >
          {children}
        </div>
      </main>
    </>
  );
};
