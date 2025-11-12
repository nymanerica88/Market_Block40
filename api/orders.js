import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
} from "#db/queries/orders";
import {
  addProductsToOrder,
  getProductsByOrder,
  getOrdersByProduct,
} from "#db/queries/orders_products";
import requireUser from "#middleware/requireUser";

const ordersRouter = express.Router();

ordersRouter.get("/", requireUser, async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const orders = await getOrdersByUserId({ user_id });
    res.status(200).json(orders);
  } catch (error) {
    console.error(`Error retrieving order list`, error);
    next(error);
  }
});

export default ordersRouter;
