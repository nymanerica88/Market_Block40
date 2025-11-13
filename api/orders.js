import express from "express";
import {
  createOrder,
  getOrderById,
  getOrdersByUserId,
} from "#db/queries/orders";
import {
  addProductToOrder,
  getProductsByOrder,
} from "#db/queries/orders_products";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import { getProductById } from "#db/queries/products";

const ordersRouter = express.Router();

ordersRouter.post(
  "/",
  requireBody(["date"]),
  requireUser,
  async (req, res, next) => {
    try {
      const user_id = req.user.id;
      const { date, note = "" } = req.body;
      console.log(req.body);
      if (!date) {
        return res.status(400).send(`Missing required fields: date`);
      }
      const order = await createOrder({ date, note, user_id });
      res.status(201).json(order);
    } catch (error) {
      console.error(`Error creating order`, error);
      next(error);
    }
  }
);

ordersRouter.get("/", requireUser, async (req, res, next) => {
  try {
    const user_id = req.user.id;
    // console.log(req.user);
    const orders = await getOrdersByUserId({ user_id });
    console.log(orders);
    res.status(200).json(orders);
  } catch (error) {
    console.error(`Error retrieving order list`, error);
    next(error);
  }
});

ordersRouter.get("/:id", requireUser, async (req, res, next) => {
  try {
    const id = +req.params.id;
    console.log(typeof id);
    const user_id = req.user.id;
    const order = await getOrderById({ id });
    if (!order) {
      return res.status(404).send(`Order not found`);
    }

    console.log(order);
    console.log(order.user_id !== user_id, order.user_id, user_id);
    if (order.user_id !== user_id) {
      return res
        .status(403)
        .send("Forbidden: This order is owned by another customer");
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(`Error retrieving order`, error);
    next(error);
  }
});

ordersRouter.post(
  "/:id/products",
  requireUser,
  requireBody(["productId", "quantity"]),
  async (req, res, next) => {
    try {
      const order_id = Number(req.params.id);
      const { productId, quantity } = req.body;
      const user_id = req.user.id;

      const order = await getOrderById({ id: order_id });
      if (!order) return res.status(404).send("Order not found");

      if (order.user_id !== user_id)
        return res
          .status(403)
          .send("Forbidden: This order belongs to another user");

      const product = await getProductById({ id: productId });
      if (!product) return res.status(400).send("Product does not exist");

      const productAdded = await addProductToOrder({
        order_id,
        product_id: productId,
        quantity,
      });

      res.status(201).json(productAdded);
    } catch (error) {
      next(error);
    }
  }
);

ordersRouter.get("/:id/products", requireUser, async (req, res, next) => {
  try {
    const order_id = Number(req.params.id);
    const user_id = req.user.id;

    const order = await getOrderById({ id: order_id });
    if (!order) return res.status(404).send("Order not found");
    if (order.user_id !== user_id)
      return res
        .status(403)
        .send("Forbidden: This order belongs to another user");

    const products = await getProductsByOrder({ order_id, user_id });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

export default ordersRouter;
