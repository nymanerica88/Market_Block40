import db from "#db/client";

export async function addProductToOrder(order_id, product_id) {
  try {
    const sql = `
        INSERT INTO orders_products (order_id, product_id)
        VALUES ($1, $2)
        REUTRNING *       
        `;

    const values = [order_id, product_id];
    const { rows: productAddedToOrder } = await db.query(sql, values);
    console.log(`Product ${product.name} has been added to order`);
    return productAddedToOrder;
  } catch (error) {
    console.error(`Product could not be added to order`, error);
    throw error;
  }
}
