import express from "express";
import { getAllProducts, getProductById } from "#db/queries/products";
import { getOrdersByProduct } from "#db/queries/orders_products";
import requireUser from "#middleware/requireUser";

const productsRouter = express.Router();

//GET route at /products; adds a GET route to productsRouter
//Awaits the response from getAllProducts and then sends all products if successful
//If unsuccuessful, it shows error message "Error retrieving product list" and moves to the next middleware
productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (error) {
    console.error(`Error retrieving product list`, error);
    next(error);
  }
});

//GET route at /products/:id; adds a GET route to productsRouter
//const id - turns the id number into a number format
//Awaits response from getProductById({id}) - passes the id in as an object
//If there's an error retrieving product by id number, shows 404[Not Found] error and Product Not Found message
//Sends the product if successful
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

//GET route at /products/:id/orders; adds a GET route to productsRouter
//const product_id = Number(req.params.id) - takes the id from the URL and turns it into a number
//const user_id = req.user.id - grabs the user_id
//const product - awaits response from getProductById (with the product_id used as a parameter in the function)
////if there is an error retrieving product, it returns a 404 error and a message "Product not found"
//const orders - awaits response from getOrdersByProduct(with the product_id and user_id passed in as parameters)
////if successful, shows a status of 200[OK], and sends the orders
//if there's an error, it shows a message of "Error retrieving orders for product"
productsRouter.get("/:id/orders", requireUser, async (req, res, next) => {
  try {
    const product_id = Number(req.params.id);
    const user_id = req.user.id;

    const product = await getProductById({ id: product_id });
    if (!product) return res.status(404).send("Product not found");

    const orders = await getOrdersByProduct({ product_id, user_id });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error retrieving orders for product", error);
    next(error);
  }
});

export default productsRouter;
