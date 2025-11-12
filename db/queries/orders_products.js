import db from "#db/client";

export async function addProductToOrder(order_id, product_id, quantity) {
  try {
    const sql = `
        INSERT INTO orders_products (order_id, product_id, quantity)
        VALUES ($1, $2, $3)
        REUTRNING *       
        `;

    const values = [order_id, product_id, quantity];
    const { rows: productAddedToOrder } = await db.query(sql, values);
    console.log(
      `Product: ${product.name}, Quantity: ${quantity} has been added to order`
    );
    return productAddedToOrder;
  } catch (error) {
    console.error(`Product could not be added to order`, error);
    throw error;
  }
}

export async function getProductsByOrder(order_id) {
  try {
    const sql = `
        SELECT *
        FROM products
        JOIN orders_products ON products.id = orders_products.product_id
        WHERE 
            orders_products.order_id = $1
            AND orders.user_id = $2
        ORDER BY products.id        
        `;

    const values = [order_id];
    const { rows: productsInOrder } = await db.query(sql, values);
    return productsInOrder;
  } catch (error) {
    console.error(`Error retriving products in order`, error);
    throw error;
  }
}

export async function getOrdersByProduct(product_id) {
  try {
    const sql = `
        SELECT *
        FROM orders
        JOIN orders_products ON orders.id = orders_products.order_id
        WHERE 
            orders_products.product_id = $1
            AND orders.user_id = $2
        ORDER BY orders.id
        `;

    const values = [product_id];
    const { rows: ordersContainingProduct } = await db.query(sql, values);
    return ordersContainingProduct;
  } catch (error) {
    console.error(`Error getting orders containing this product`, error);
    throw error;
  }
}
