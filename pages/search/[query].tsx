import { GetServerSideProps, NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { dbProducts } from "../../database";
import { IProduct } from "../../interfaces";

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  return (
    <ShopLayout
      title={"Kiko-Shop - Search"}
      pageDescription={"Encuentra los mejores productos de Kiko aquí"}
    >
      <h1>Buscar productos </h1>
      {foundProducts ? (
        <h2 style={{ fontWeight: 500}}>Término: {query}</h2>
      ) : (
        <div>
          <h2 style={{ fontWeight: 500}}>
            No se encontraron resultados para: <span style={{ color:'var(--blue-color)', fontWeight: 500, textTransform: 'capitalize'}}>{query}</span>
          </h2>
        </div>
      )}
      <ProductList products={products} />
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string };

  if (query.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let products = await dbProducts.getProductsByTerm(query);
  const foundProducts = products.length > 0;

  if (!foundProducts) {
    products = await dbProducts.getAllProducts();
  }

  return {
    props: {
      products,
      foundProducts,
      query,
    },
  };
};

export default SearchPage;
