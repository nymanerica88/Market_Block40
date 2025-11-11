import db from "#db/client";

//createProduct - creates a new product with title, description, and price
//($1,$2, $3) are placeholders to prevent sequel injection
//RETURNING * returns the new row from the database
//{rows: [products]} takes the first row of the array and assigns it to the product
//return products returns the new product (object) that was just created
export async function createProduct(title, description, price) {
  const sql = `
    INSERT INTO products (title, description, price)
    VALUES ($1, $2, $3)
    RETURNING *
    `;

  const {
    rows: [products],
  } = await db.query(sql, [title, description, price]);
  return products;
}

//getAllProducts - retrieves all products in the products table
// const { rows: products } the syntax changes because we're returning an array
////of all products (there will be multiple returned) vs a single object (one product)
////like in createProduct
//return products returns the array of products from the table
export async function getAllProducts() {
  const sql = `
    SELECT *
    FROM products
    `;

  const { rows: products } = await db.query(sql);
  return products;
}

//getProductsById - retrieves product by id number
//rows: [products]} since the product id is the primary key, it is unique, so this will only
////return a single object, so the same syntax that was used for createProduct is also used here
export async function getProductById(id) {
  const sql = `
    SELECT *
    FROM products
    WHERE id = $1
    `;

  const {
    rows: [products],
  } = await db.query(sql, [id]);
  return products;
}
