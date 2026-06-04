import type { Request, Response } from "express";

export const LoginCentre = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    res.send("Hello");
  } catch (error: any) {
    res.status(500).send(new Error(error).message);
  }
};
