import { model, Schema, Types } from "mongoose";

interface IExamSession {
  cbtExamination: Types.ObjectId;
  sessionName: string;
  sessionCode: string;
  sessionNumber: number;
  status: string;
}

const schema = new Schema<IExamSession>(
  {
    cbtExamination: { type: Schema.Types.ObjectId, name: "CBTExamination" },
    sessionName: { type: String, lowercase: true },
    sessionCode: { type: String, lowercase: true },
    sessionNumber: { type: Number },
    status: { type: String },
  },
  { timestamps: true },
);

const ExamSessionModel = model("ExamSession", schema);

export default ExamSessionModel;
