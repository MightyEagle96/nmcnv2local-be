import { Request, Response } from "express";
import Candidate from "../models/candidateModel.js";

export const loginCandidate = async (req: Request, res: Response) => {
  try {
    await Candidate.findOne({ indexNumber: req.body.indexNumber });
  } catch (error) {}
};

export const preLoginCandidate = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
