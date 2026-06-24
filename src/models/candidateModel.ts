import mongoose, { Schema, Types, model } from "mongoose";

import ProgrammeModel from "./programmeModel.js";
import { Request } from "express";

export interface ICandidate {
  firstName: string;
  middleName: string;
  lastName: string;
  indexNumber: string;

  programmes: Types.ObjectId[];
  examSession: Types.ObjectId;
  cbtExamination: Types.ObjectId;
  centre: Types.ObjectId;
  assignedToCentre: boolean;
  error: boolean;

  centreId: string;
  state: string;
  centreName: string;
  avatar: string;
  school: string;
  synchronized: boolean;
  synchronizedTime?: Date;
  programmeCodes: String;
  duration?: number;
  sessionId: number;
  invalidProgrammeIds: Types.ObjectId[];
  questionCategory: number;
  loggedIn: boolean;
  ipAddress: string;
  submitted: boolean;
  flaggedForInfraction: boolean;
  responseCount: number;
  loggedInTime: Date;
  submittedTime: Date;
  loginCount: number;
  _id: Types.ObjectId;
}

export interface AuthenticatedCandidate extends Request {
  candidate?: ICandidate;
}

const schema = new Schema<ICandidate>(
  {
    firstName: { type: String, lowercase: true, default: "" },
    middleName: { type: String, lowercase: true, default: "" },
    lastName: { type: String, lowercase: true, default: "" },
    indexNumber: { type: String, lowercase: true },
    cbtExamination: { type: Schema.Types.ObjectId, ref: "CBTExamination" },
    examSession: { type: Schema.Types.ObjectId, ref: "ExamSession" },
    programmes: [{ type: Schema.Types.ObjectId, ref: "Programme" }],
    error: { type: Boolean, default: false },
    invalidProgrammeIds: [{ type: Schema.Types.ObjectId, ref: "Programme" }],
    centre: { type: Schema.Types.ObjectId, ref: "Centre" },
    assignedToCentre: { type: Boolean, default: false },
    centreId: { type: String, lowercase: true },
    state: { type: String, lowercase: true },
    centreName: { type: String, lowercase: true },
    avatar: { type: String },
    school: { type: String, lowercase: true },
    synchronized: { type: Boolean },
    synchronizedTime: { type: Date },
    programmeCodes: String,
    duration: { type: Number, default: 0 },
    sessionId: { type: Number, default: 0 },
    questionCategory: { type: Number, default: 0 },
    loggedIn: { type: Boolean, default: false },
    ipAddress: { type: String },
    submitted: { type: Boolean, default: false },
    flaggedForInfraction: { type: Boolean, default: false },
    responseCount: { type: Number, default: 0 },
    loggedInTime: { type: Date },
    submittedTime: { type: Date },
    loginCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);
schema.index(
  { indexNumber: 1, cbtExamination: 1, examSession: 1 },
  { unique: true },
);

const Candidate = model("Candidate", schema);

export default Candidate;
