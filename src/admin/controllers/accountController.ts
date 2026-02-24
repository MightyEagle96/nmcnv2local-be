import { Request, Response } from "express";
import { httpService } from "../../httpService";
import CentreModel from "../models/centreModel";
import {
  generateRefreshToken,
  generateToken,
  tokens,
} from "../../jwtController";

export const loginCentre = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const result = await httpService.post("/server/login", body);

    if (result.status === 200) {
      await CentreModel.create(result.data);

      const accessToken = generateToken(result.data);
      const refreshToken = generateRefreshToken(result.data);

      res
        .cookie(tokens.auth_token, accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .cookie(tokens.refresh_token, refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .sendStatus(200);
    } else res.status(result.status).send(result.data);
  } catch (error: any) {
    res.status(500).send(new Error(error).message);
  }
};
