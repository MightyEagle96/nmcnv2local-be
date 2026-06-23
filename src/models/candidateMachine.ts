import { Types, Schema, model } from "mongoose";

interface ICandidateMachine {
  candidate: Types.ObjectId;
  machineDetails: MachineDetail[];
  cbtExamination: Types.ObjectId;
  centre: Types.ObjectId;
  examSession: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface MachineDetail {
  ipAddress: string;
  os: string;
  osVersion: string;
  browser: string;
  browerVersion: string;
  loginTime: Date;
  logoutTime: Date;
}

const schema = new Schema<ICandidateMachine>(
  {
    candidate: { type: Schema.Types.ObjectId, ref: "Candidate" },
    cbtExamination: { type: Schema.Types.ObjectId, ref: "CBTExamination" },
    examSession: { type: Schema.Types.ObjectId, ref: "ExamSession" },
    centre: { type: Schema.Types.ObjectId, ref: "Centre" },
    machineDetails: [
      {
        ipAddress: String,
        os: String,
        osVersion: String,
        browser: String,
        browerVersion: String,
        loginTime: Date,
        logoutTime: Date,
      },
    ],
  },
  { timestamps: true },
);

schema.index(
  { candidate: 1, cbtExamination: 1, examSession: 1 },
  { unique: true },
);

const CandidateMachineModel = model("CandidateMachine", schema);

export default CandidateMachineModel;

export { ICandidateMachine, MachineDetail };
