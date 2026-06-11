import { NextFunction, Request, Response, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import Centre, { ICentre } from "../models/centreModel.js";

export interface IPayload {
  _id: string;
  role: string;
}

export const appRoles = {
  admin: "admin",
  candidate: "candidate",
  questionStation: "questionStation",
  procedureStation: "procedureStation",
};

dotenv.config();

export const tokens = {
  auth_token: "auth_token",
  refresh_token: "refresh_token",
};

export function generateToken(payload: object) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN as string, {
    expiresIn: "1d",
  });
}

export function generateRefreshToken(payload: object) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN as string, {
    expiresIn: "2d",
  });
}

export interface JointInterface extends Request {
  centre?: ICentre;
}
export async function authenticateToken(
  req: JointInterface,
  res: Response,
  next: NextFunction,
) {
  try {
    // Get token from cookie
    const token = req.cookies[tokens.auth_token];

    //console.log(token);
    if (!token) {
      return res.sendStatus(401);
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN as string,
    ) as JwtPayload & IPayload;

    console.log(decoded);
    if (!decoded?._id) {
      return res.sendStatus(403);
    }

    if (decoded) {
      if (decoded.role === appRoles.admin) {
        const account = await Centre.findById(decoded._id).lean();

        if (!account) {
          return res.status(401).send("Not authenticated");
        }
        req.centre = account;
      }
    }

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).send("Token expired");
    }
    return res.status(401).send("Not authenticated");
  }
}
