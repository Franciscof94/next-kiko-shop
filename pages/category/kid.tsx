import React from "react";
import type { NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { useProducts } from "../../hooks";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";


const KidPage: NextPage = () => {
  const { products, isLoading } = useProducts("/products?gender=kid");

  return (
    <ShopLayout
      title={"Kiko-Shop - Kids"}
      pageDescription={"Encuentra los mejores productos de Teslo para niños"}
    >
      <h1>Niños</h1>
      <h2>Productos para niños</h2>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default KidPage;
