import { Request, Response } from "express";
import CBTExamModel from "../models/cbtExaminationModel.js";

export const GetExaminationsWithSessions = async (
  req: Request,
  res: Response,
) => {
  try {
    const examinations = await CBTExamModel.aggregate([
      {
        $lookup: {
          from: "examsessions", // collection name of ExamSession
          localField: "_id",
          foreignField: "cbtExamination",
          as: "sessions",
        },
      },
      {
        $project: {
          name: 1,
          active: 1,
          scheduledTime: 1,
          sessions: {
            _id: 1,
            sessionName: 1,
            sessionCode: 1,
            sessionNumber: 1,
            status: 1,
          },
        },
      },
      {
        $sort: {
          scheduledTime: -1,
        },
      },
    ]);

    return res.status(200).json(examinations);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch examinations",
      error,
    });
  }
};
