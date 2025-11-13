import express from "express";
const usersRouter = express.Router();

//import { createUser, getUserByUsernameAndPassword } - imports database query functions
//import requireBody from "#middleware/requireBody"; - imports middleware function
//import { createToken } from "#utils/jwt"; - imports helper function for the token

import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

//POST (add) route at /register
//requireBody ensures username and password exist in the request body
//createUser inserts the new user into the database
//createToken creates the JWT token containing the user id
//sends 201 [Created] and returns the token
usersRouter.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await createUser({ username, password });
      const token = createToken({ id: user.id });
      res.status(201).send(token);
    } catch (error) {
      next(error);
    }
  }
);

//POST route at /login
//again, requireBody ensures username and password exist in the request body
//getUserByUsernameAndPassword retrieves the user if the user exists; user will be null if DNE
//if authentication fails 401 [Unauthorized] and sends an error message
//if authentication success, token is created and sent
usersRouter.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await getUserByUsernameAndPassword({ username, password });
      if (!user)
        return res.status(401).send("Invalid username and/or password");
      const token = createToken({ id: user.id });
      res.status(200).send(token);
    } catch (error) {
      next(error);
    }
  }
);

export default usersRouter;
