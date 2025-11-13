import db from "#db/client";

//addProductToOrder - adds a new product to an existing order
//($1, $2, $3) are placeholders to prevent sequel injection
//RETURNING * returns the new row from the database
//{rows: [productAddedToOrder]} assigns first row of the array to thr product added to the order
////renames "rows" to "productAddedToOrder"
//return productAddedToOrder returns the product added to order (object)
//console.log - if a product is sucessfully added to the order, it shows a message showing the
///name of the product and the quantity of the product added to the order with a confirmation
export async function addProductToOrder({ order_id, product_id, quantity }) {
  try {
    const sql = `
        INSERT INTO orders_products (order_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *       
        `;

    const values = [order_id, product_id, quantity];
    const {
      rows: [productAddedToOrder],
    } = await db.query(sql, values);
    console.log(`New product(s) have been added to this order`);
    return productAddedToOrder;
  } catch (error) {
    console.error(`Product could not be added to order`, error);
    throw error;
  }
}

//getProductsByOrder - returns all of the products included on the order_id passed in for that user only
//sql - returns all items from the products table for the given order
////JOIN creates an inner join (combines rows from both tables, but only includes rows where there is a match)
////////match: the (product) id in the products table is equalto the product_id in the orders_products table;
///////match: the (order) id in the orders table is equal to the order_id in the order_products table;
export async function getProductsByOrder({ order_id, user_id }) {
  try {
    const sql = `
        SELECT products.*, orders_products.quantity
        FROM products
        JOIN orders_products ON products.id = orders_products.product_id
        JOIN orders ON orders.id = orders_products.order_id
        WHERE 
            orders_products.order_id = $1
            AND orders.user_id = $2
        ORDER BY products.id        
        `;

    const values = [order_id, user_id];
    const { rows: productsInOrder } = await db.query(sql, values);
    return productsInOrder;
  } catch (error) {
    console.error(`Error retriving products in order`, error);
    throw error;
  }
}

//getOrdersByProduct - returns all of the orders containing the product_id passed in for that user only
//sql - returns all items from the orders table for the given product
////JOIN creates an inner join (combines rows from both tables, but only includes rows where there is a match)
////////match: the (orders) id in the orders table is equalto the order_id in the orders_products table;
export async function getOrdersByProduct({ product_id, user_id }) {
  try {
    const sql = `
        SELECT orders.*
        FROM orders
        JOIN orders_products ON orders.id = orders_products.order_id
        WHERE 
            orders_products.product_id = $1
            AND orders.user_id = $2
        ORDER BY orders.id
        `;

    const values = [product_id, user_id];
    const { rows: ordersContainingProduct } = await db.query(sql, values);
    return ordersContainingProduct;
  } catch (error) {
    console.error(`Error getting orders containing this product`, error);
    throw error;
  }
}
