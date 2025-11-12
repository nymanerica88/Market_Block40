import bcrypt from "bcrypt";
import db from "#db/client";

//createUser - creates a new user with username and password in the database
//($1,$2) are placeholders to prevent SQL injection
//RETURNING * returns the new row from the database
//bcrypt.hash scrambles the plain text password; applies the scramble 10x
//{rows: [user]} takes the first row of the array and assigns it to the user
//return user returns the new user that was just created
export async function createUser({ username, password }) {
  try {
    const sql = `
      INSERT INTO users (username, password) 
      VALUES ($1, $2) 
      RETURNING *
      `;

    const hashedPassword = await bcrypt.hash(password, 10);
    const values = [username, hashedPassword];
    const {
      rows: [user],
    } = await db.query(sql, values);
    return user;
  } catch (error) {
    console.error(`Error creating user`, error);
    throw error;
  }
}

//getUserByUsernameAndPassword - identifies user by username and password for login
//selects all records from the users table where the username is equal to the username that was passed in
//again,{rows: [user]} takes the first row of the array and assigns it to the user
//if no user is found, it returns null [if (!user) return null;]
//bcrypt.compare is a boolean that returns true if the hashed password matches the plaintext password and false if not
//if the password authentication fails, returns null, if it passes, it returns the user
export async function getUserByUsernameAndPassword({ username, password }) {
  try {
    const sql = `
      SELECT *
      FROM users
      WHERE username =$1
      `;

    const values = [username];
    const {
      rows: [user],
    } = await db.query(sql, values);
    if (!user) return null;

    const authenticated = await bcrypt.compare(password, user.password);
    if (!authenticated) return null;

    return user;
  } catch (error) {
    console.error(`Error getting User`, error);
    throw error;
  }
}

//getUsersByID - returns user by their id number (which is unique per the schema)
//returns all records from the users table where the id is equal to the id that was passed in
//again,{rows: [user]} takes the first row of the array and assigns it to the user
//returns the user object (if found); undefined, if not found
export async function getUserById({ id }) {
  try {
    const sql = `
      SELECT *
      FROM users
      WHERE id = $1
      `;

    const values = [id];
    const {
      rows: [user],
    } = await db.query(sql, values);
    return user;
  } catch (error) {
    console.error(`Error Getting User By Id`, error);
    throw error;
  }
}
