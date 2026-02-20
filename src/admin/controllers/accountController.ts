import { Request, Response } from "express";
import { httpService } from "../../httpService";

export const loginCentre = async (req: Request, res: Response) => {
  const body = req.body;

  const result = await httpService.post("/server/login", body);

  console.log(result);
  res.send("loginCentre");
};
