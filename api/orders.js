import express from "express";
//imports query functions from orders
import {
  createOrder,
  getOrderById,
  getOrdersByUserId,
} from "#db/queries/orders";
//imports query functions from orders_products (join table)
import {
  addProductToOrder,
  getProductsByOrder,
} from "#db/queries/orders_products";
//imports provided middleware
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
//imports getProductById query from products
import { getProductById } from "#db/queries/products";

const ordersRouter = express.Router();

//POST route at /orders; adds route to ordersRouter
//requires date in the body; requires user to be logged-in
//const user_id = req.user.id - obtains the id of logged in user
//const { date, note = "" } = req.body - ensures date is included in
////the request body and that ***note is optionl***; spent several hours
////debugging this because making notes required causes the rest of the test
////cases to fail; if there's an issue with the date, sends 400[Bad Request]
////and a message of "Missing required fields: date"
//const order - creates the new order, sends 201[Created] if the order creation
////is successful; if unsuccessful, the message "Error creating order" shows
ordersRouter.post(
  "/",
  requireBody(["date"]),
  requireUser,
  async (req, res, next) => {
    try {
      const user_id = req.user.id;
      const { date, note = "" } = req.body;
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

//GET route at /orders; adds route to the ordersRouter
//const user_id = req.user.id - obtains the id of logged in user
//await response from getOrdersById (passing in user_id as a parameter)
////if successful, 200[OK]; sends list of orders
////if unsuccessful, shows message "Error retrieving order list"
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

//GET route at /orders/id; adds route to ordersRouter
//const id - takes the id number from the URL and converts it into a number
//const user_id = req.user.id - obtains the id of logged in user
//const order awaits response from getOrderById (passing in the id as a parameter)
////if error with order, returns 404[Not Found], and message "Order Not Found"
////if (order.user_id !== user_id) - if the order user_id doesn't match the logged in user_id
////returns status 403[Forbidden] and the message "Error retrieving order"
ordersRouter.get("/:id", requireUser, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user_id = req.user.id;
    const order = await getOrderById({ id });
    if (!order) {
      return res.status(404).send(`Order not found`);
    }
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

//POST route at /orders/:id/products; adds route to ordersRouter
//requireBody(["productId", "quantity"]) - makes sure productId and quantity are present
////in the request body
//const order_id - converts the order id number into a number
//const user_id = req.user.id - obtains the id of logged in user
//const order - awaits response from getOrdersById (passes in the order_id as a parameter)
////if there's an issue with order, response 404[Not Found] and displays message "Order Not Found"
////if (order.user_id !== user_id) - if the order user_id doesn't match the logged in user_id
////returns 403[Forbidden] and the message "Error retrieving order"
//const product - await get ProductById (passes productId as a parameter)
////if error with product, return status 400[Bad Request]; shows message "Product does not Exist"
//const productAdded - awaits success of add ProductToOrder using the provided user inputs
////if successful, status 201[Created], shows the added product; if unsuccessul, shows `Error adding product to order`
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
      console.error(`Error adding product to order`, error);
      next(error);
    }
  }
);

//GET route at /orders/:id/products; adds route to ordersRouter
//const order_id - converts the order id number into a number
//const user_id = req.user.id - obtains the id of logged in user
//const order - awaits response from getOrderById (with order_id passed as a parameter)
////if error with order, status 404[Not Found], sends message ("Order Not Found")
////if (order.user_id !== user_id) - if the order user_id doesn't match the logged in user_id
////returns 403[Forbidden] and the message "Error retrieving order"
//const products - awaits the response from getProductsByOrderId (with order_id and user_id
// passed in as parameters); if successful, status 200[OK]; if unsuccessful, shows `Error retrieving prodcuts by Order`
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
    console.error(`Error retrieving products by Order`);
    next(error);
  }
});

export default ordersRouter;
