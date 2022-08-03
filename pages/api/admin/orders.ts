import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IOrder } from "../../../interfaces";
import { Order, User } from "../../../models";
import { jwt } from "../../../utils";

type Data =
  | {
      message: string;
    }
  | IOrder[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getOrders(req, res);
    default:
      return res.status(400).json({ message: "Bad request" });
  }
}
const getOrders = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token = "" } = req.cookies;

  let userId = "";
  try {
    userId = await jwt.isValidToken(token);
  } catch (error) {
    console.log(error);
  }

  if (!userId) {
    return new Response(JSON.stringify({ message: "No autorizado" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
  const orders = await Order.find()
    .sort({ createdAt: "desc" })
    .populate("user", "name email")
    .lean();
  await db.disconnect();

  return res.status(200).json(orders);
};
