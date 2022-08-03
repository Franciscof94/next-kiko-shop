import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IOrder } from "../../../interfaces";
import { Product } from "../../../models";
import Order from "../../../models/Order";
import { jwt } from "../../../utils";

type Data = |{
  message: string;
} | IOrder;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return createOrder(req, res);
    default:
      return res.status(400).json({ message: "Bad request" });
  }
}
const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder;
  const { token = "" } = req.cookies;

  const session = await jwt.isValidToken(token);

  if (!session) {
    return res
      .status(401)
      .json({ message: "Debe estar autenticado para finalizar la compra" });
  }

  const productsIds = orderItems.map((p) => p._id);
  await db.connect();
  const dbProducts = await Product.find({ _id: { $in: productsIds } });

  try {
    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find(
        (prod) => prod.id === current._id
      )!.price;
      if (!currentPrice) {
        throw new Error("Verifique que los productos existan");
      }
      return currentPrice * current.quantity + prev;
    }, 0);


    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const backendTotal = subTotal * (taxRate + 1);

    if(total !== backendTotal) {
      throw new Error("El total no coincide con el calculado");
    }
    const userId = session;
    const newOrder = new Order({...req.body, isPaid: false, user: userId})
    newOrder.total = Math.round(newOrder.total * 100) / 100;
    await newOrder.save() 
    await db.disconnect();
    return res.status(201).json(newOrder);
   
  } catch (error) {
    await db.disconnect();
    console.log(error);
    return res.status(400).json({ message: "Error al crear la orden" });
  }

};
