import { Request, Response, NextFunction } from "express";
import Centre from "../models/centreModel.js";
import ExamSessionModel from "../models/examSessionModel.js";
import ExamCentreModel from "../models/examCentreModel.js";
import { httpService } from "../httpService.js";

export const authenticateCentre = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const centre = await Centre.findOne();

    if (!centre) {
      res.sendStatus(401);
      return;
    }

    req.headers.centreid = centre._id.toString();
    next();
  } catch (error) {
    res.sendStatus(401);
  }
};

export const downloadExamSessions = async (req: Request, res: Response) => {
  await Promise.all([
    ExamSessionModel.deleteMany(),
    ExamCentreModel.deleteMany(),
  ]);

  const response = await httpService.get("download/sessions", {
    headers: { centreid: req.headers.centreid },
  });

  if (response.status === 200) {
    const { sessions, examCentre } = response.data;
    await ExamSessionModel.insertMany(sessions);

    await ExamCentreModel.create(examCentre);
  }

  res.send("Examination sessions downloaded");
};
