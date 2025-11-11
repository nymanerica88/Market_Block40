import db from "#db/client";

//createOrder - creates a new order with date, note, user_id
//($1, $2, $3) are placeholders to prevent sequel injection
//RETURNING * returns the new row from the database
//{rows: [newOrder]} assigns first row of the array to the newly created order
////renames "rows" to "newOrder"
//return newOrder returns the new order (object) that was just created
export async function createOrder(date, note, user_id) {
  try {
    const sql = `
        INSERT INTO orders (date, note, user_id)
        VALUES ($1, $2, $3)
        RETURNING *;     
        `;

    const values = [date, note, user_id];
    const {
      rows: [newOrder],
    } = await db.query(sql, values);
    return newOrder;
  } catch (error) {
    console.error("Error Creating New Order", error);
    throw error;
  }
}

//getAllOrders - retrieves all orders in the orders table
//{ rows: allOrders } the syntax changes because we're returning an array
////of all orders (there will be multiple returned) vs a single object (one order)
////like in createOrder; assigns first row of the array to the newly created order
////renames "rows" to "allOrders"
//return allOrders returns the array of orders from the table
export async function getAllOrders() {
  try {
    const sql = `
        SELCECT *
        FROM orders;
        `;

    const { rows: allOrders } = await db.query(sql);
    return allOrders;
  } catch (error) {
    console.error("Error getting all orders", error);
    throw error;
  }
}

//getOrdersById - retrieves order by id number
//rows: [orderById]} since the product id is the primary key, it is unique, so this will only
////return a single object, so the same syntax that was used for createOrder is also used here
////renames "rows" to "orderById"
//return orderById returns the order (object) from the table
export async function getOrderById(id) {
  try {
    const sql = `
        SELECT *
        FROM orders
        WHERE id = $1        
        `;

    const values = [id];
    const { rows: orderById } = await db.query(sql, values);
    return orderById;
  } catch (error) {
    console.error(`Error Retrieving Order By Id`);
    throw error;
  }
}
