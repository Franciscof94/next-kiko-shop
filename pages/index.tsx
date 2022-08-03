import type { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";

import { ShopLayout } from "../components/layouts";
import { ProductList } from "../components/products";
import { FullScreenLoading } from "../components/ui";
import { useProducts } from "../hooks";
import { AppDispatch } from "../store/store";

const HomePage: NextPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading } = useProducts("/products");

    

  return (
    <ShopLayout
      title={"Kiko-Shop - Home"}
      pageDescription={"Encuentra los mejores productos de Kiko aquí"}
    >
      <h1>Shop</h1>
      <h2>Todos los productos</h2>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default HomePage;
