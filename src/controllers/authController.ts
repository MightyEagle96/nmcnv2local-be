import { Request, Response } from "express";
import {
  appRoles,
  generateRefreshToken,
  generateToken,
  IPayload,
  JointInterface,
  tokens,
} from "./jwtController.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import Centre from "../models/centreModel.js";

export const myProfile = async (req: JointInterface, res: Response) => {
  if (req.centre) {
    res.send(req.centre);
    return;
  }

  res.sendStatus(401);
};

export const getRefreshToken = async (req: JointInterface, res: Response) => {
  const refreshToken = req.cookies[tokens.refresh_token];

  if (!refreshToken) {
    return res.status(401).send("Not authenticated");
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN as string,
    ) as JwtPayload & IPayload;

    if (!decoded?._id) {
      return res.sendStatus(401);
    }
    if (decoded.role === appRoles.admin) {
      const adminAccount = await Centre.findById(decoded._id).lean();

      if (!adminAccount) {
        return res.status(401).send("Not authenticated");
      }

      const accessToken = generateToken({
        centreId: adminAccount.centreId,
        password: adminAccount.password,
        role: "admin",
      });

      const newRefreshToken = generateRefreshToken({
        centreId: adminAccount.centreId,
        password: adminAccount.password,
        role: "admin",
      });

      res
        .cookie(tokens.auth_token, accessToken, {
          httpOnly: false,
          secure: true,
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 1000 * 60 * 60, // 1h
        })
        .cookie(tokens.refresh_token, newRefreshToken, {
          httpOnly: false,
          secure: true,
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
        })
        .send("Logged In");

      return;
    }
  } catch (error) {
    res.status(401).send("Invalid refresh token");
  }
  //  res.send(req.cookies[tokens.refresh_token]);
};
