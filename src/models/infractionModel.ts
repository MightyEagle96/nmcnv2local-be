import { model, Schema, Types } from "mongoose";

interface IInfraction {
  candidate: Types.ObjectId;
  cbtExamination: Types.ObjectId;
  examSession: Types.ObjectId;
  infraction: string;
  ipAddress: string;
  dateCreated: Date;
  dateModified: Date;
}

const schema = new Schema<IInfraction>(
  {
    candidate: { type: Schema.Types.ObjectId, ref: "Candidate" },
    cbtExamination: { type: Schema.Types.ObjectId, ref: "CBTExamination" },
    examSession: { type: Schema.Types.ObjectId, ref: "ExamSession" },
    infraction: { type: String },
    ipAddress: { type: String },
    dateCreated: { type: Date, default: new Date() },
    dateModified: { type: Date, default: new Date() },
  },
  { timestamps: true },
);

const InfractionModel = model("Infraction", schema);

export default InfractionModel;
