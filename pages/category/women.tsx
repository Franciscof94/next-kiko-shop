import React from "react";
import type { NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { useProducts } from "../../hooks";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";


const WomenPage: NextPage = () => {
  const { products, isLoading } = useProducts("/products?gender=women");

  return (
    <ShopLayout
      title={"Kiko-Shop - Women"}
      pageDescription={"Encuentra los mejores productos de Kiko para mujeres"}
    >
      <h1>Mujeres</h1>
      <h2>Productos para mujeres</h2>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default WomenPage;
