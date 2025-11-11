import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
} from "#db/queries/products";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import { createToken } from "#utils/jwt";

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
    const { id } = req.params;
    const product = await getProductById(id);
    if (!product) return res.status(404).send("Product not found.");
    res.send(product);
  } catch (error) {
    console.error(`Product ID Not Found`, error);
    next(error);
  }
});

export default productsRouter;
