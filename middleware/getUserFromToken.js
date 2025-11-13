import { getUserById } from "#db/queries/users";
import { verifyToken } from "#utils/jwt";

/**
 * Middleware: Attaches the user to req.user if a valid token is provided.
 * If the token is missing or invalid, req.user remains undefined.
 */
export default async function getUserFromToken(req, res, next) {
  try {
    const authHeader = req.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // No token provided: skip user assignment
      return next();
    }

    const token = authHeader.split(" ")[1];

    // Verify token and get user ID
    const payload = verifyToken(token);

    if (!payload?.id) {
      // Invalid token structure
      return next();
    }

    // Retrieve user from DB
    const user = await getUserById(payload.id);

    if (!user) {
      // Token references a user that doesn't exist
      return next();
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in getUserFromToken:", error);
    // Do not send 401 here: let requireUser handle unauthorized routes
    next();
  }
}

// import { getUserById } from "#db/queries/users";
// import { verifyToken } from "#utils/jwt";

// /** Attaches the user to the request if a valid token is provided */
// export default async function getUserFromToken(req, res, next) {
//   const authorization = req.get("authorization");
//   if (!authorization || !authorization.startsWith("Bearer ")) return next();

//   const token = authorization.split(" ")[1];

//   try {
//     const { id } = verifyToken(token);
//     const user = await getUserById(id);
//     if (!user) {
//       console.warn(`Token user id ${id} not found in Db. Ignoring token.`);
//       return next();
//     }

//     req.user = user;
//     next();
//   } catch (e) {
//     console.error(e);
//     res.status(401).send("Invalid token.");
//   }
// }
