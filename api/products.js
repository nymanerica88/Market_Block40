import express from "express";
import { getAllProducts, getProductById } from "#db/queries/products";
import { getOrdersByProduct } from "#db/queries/orders_products";
import requireUser from "#middleware/requireUser";
// import requireBody from "#middleware/requireBody";
// import { createToken } from "#utils/jwt";

const productsRouter = express.Router();

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (error) {
    console.error(`Error retrieving product list`, error);
    next(error);
  }
});

productsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await getProductById({ id });
    if (!product) return res.status(404).send("Product not found.");
    res.send(product);
  } catch (error) {
    console.error(`Product ID Not Found`, error);
    next(error);
  }
});

productsRouter.get("/:id/orders", requireUser, async (req, res, next) => {
  try {
    const product_id = Number(req.params.id);
    const user_id = req.user.id;

    const product = await getProductById({ id: product_id });
    if (!product) return res.status(404).send("Product not found");

    const orders = await getOrdersByProduct({ product_id, user_id });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error retieving orders for product", error);
    next(error);
  }
});

export default productsRouter;
