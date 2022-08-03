import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Order, Product, User } from "../../../models";
import { jwt } from "../../../utils";

type Data = {
  numberOfOrders: number;
  paidOrders: number;
  notPaidOrders: number;
  numberOfClients: number;
  numberOfProducts: number;
  productsWithNoInventory: number;
  lowInventory: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { token = "" } = req.cookies;

  let userId = "";
  try {
    userId = await jwt.isValidToken(token);
  } catch (error) {
    console.log(error);
  }

  if(!userId) {
    return new Response(JSON.stringify({ message: 'No autorizado'}), {
        status: 401,
        headers: {
            'Content-Type': 'application/json'
        }
    })
  }

  await db.connect();
  const user = await User.findById(userId).lean();
  await db.disconnect();

  const validRoles = ["admin", "super-user", "SEO"];

  if (!user || !validRoles.includes(user.role)) {
    return new Response(
      JSON.stringify({
        message: "No tienes permisos para acceder a este recurso",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  await db.connect();
  const [
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  ] = await Promise.all([
    Order.count(),
    Order.find({ isPaid: true }).count(),
    User.find({ role: "client" }).count(),
    Product.count(),
    Product.find({ inStock: 0 }).count(),
    Product.find({ inStock: { $lte: 10 } }).count(),
  ]);

  await db.disconnect();

  res.status(200).json({
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
    notPaidOrders: numberOfOrders - paidOrders,
  });
}
