// @ts-check
import { isValidObjectId } from "mongoose";

/**
 * Checks if the req.params.id is a valid Mongoose ObjectId.
 *
 * @param {import ('express').Request} req - the Express request object.
 * @param {import ('express').Response} res - The Express response object.
 * @param {import ('express').NextFunction} next - The Express next middleware function.
 * @throws {Error} - Throws an error if the ObjectID is invalid
 *
 */

export default function checkObjectId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error(`Invalid ObjectID of: ${req.params.id}`);
  }
  next();
}
