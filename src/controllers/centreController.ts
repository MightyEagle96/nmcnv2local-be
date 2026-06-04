import type { Request, Response } from "express";

export const LoginCentre = async (req: Request, res: Response) => {
  try {
  } catch (error: any) {
    res.status(500).send(new Error(error).message);
  }
};
