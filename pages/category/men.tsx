import React from "react";
import type { NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { useProducts } from "../../hooks";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";


const MenPage: NextPage = () => {
  const { products, isLoading } = useProducts("/products?gender=men");

  return (
    <ShopLayout
      title={"Kiko-Shop - Men"}
      pageDescription={"Encuentra los mejores productos de Kiko para hombres"}
    >
      <h1>Hombres</h1>
      <h2>Productos para hombres</h2>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default MenPage;
