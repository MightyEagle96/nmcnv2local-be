import { Request, Response, NextFunction } from "express";
import Centre, { AuthenticatedCentre } from "../models/centreModel.js";
import ExamSessionModel from "../models/examSessionModel.js";
import ExamCentreModel from "../models/examCentreModel.js";
import { httpService } from "../httpService.js";
import CBTExamModel from "../models/cbtExaminationModel.js";
import ProgrammeModel from "../models/programmeModel.js";
import questionBankModel from "../models/questionBankModel.js";

export const authenticateCentre = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const centre = await Centre.findOne({
      active: true,
    }).lean();

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

// export const downloadExamSessions = async (req: Request, res: Response) => {
//   await Promise.all([
//     ExamSessionModel.deleteMany(),
//     ExamCentreModel.deleteMany(),
//   ]);

//   const response = await httpService.get("download/sessions", {
//     headers: { centreid: req.headers.centreid },
//   });

//   if (response.status === 200) {
//     const { sessions, examCentre } = response.data;
//     await ExamSessionModel.insertMany(sessions);

//     await ExamCentreModel.create(examCentre);
//   }

//   res.send("Examination sessions downloaded");
// };

export const downloadExamination = async (req: Request, res: Response) => {
  try {
    const response = await httpService.get("server/download/examination", {
      headers: { centreid: req.headers.centreid },
    });

    if (response.status !== 200) {
      return res.status(response.status).send(response.data);
    }

    const { _id, ...rest } = response.data;

    await CBTExamModel.updateOne(
      { _id },
      { $set: { ...rest } },
      {
        upsert: true,
      },
    );

    console.log(response.data);

    res.send("Examination downloaded");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error downloading examination");
  }
};

export const downloadProgrammes = async (req: Request, res: Response) => {
  try {
    const response = await httpService.get("server/download/programmes", {
      headers: { centreid: req.headers.centreid },
    });

    if (response.status !== 200) {
      return res.status(response.status).send(response.data);
    }

    const programmes = response.data;

    await ProgrammeModel.deleteMany({});

    await ProgrammeModel.insertMany(programmes, { ordered: false });

    res.send("Programmes downloaded");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error downloading programmes");
  }
};

export const downloadQuestionBanks = async (req: Request, res: Response) => {
  try {
    const response = await httpService.get("server/download/questionbanks", {
      headers: { centreid: req.headers.centreid },
    });

    if (response.status !== 200) {
      return res.status(response.status).send(response.data);
    }

    const questionBanks = response.data;

    await questionBankModel.deleteMany({});

    await ProgrammeModel.insertMany(questionBanks, { ordered: false });

    // const programmes = response.data;

    // await ProgrammeModel.deleteMany({});

    // await ProgrammeModel.insertMany(programmes, { ordered: false });

    res.send("Programmes downloaded");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error downloading programmes");
  }
};

function shuffle<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
