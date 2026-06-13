import { model, Schema, Types } from "mongoose";

interface IExamSession {
  cbtExamination: Types.ObjectId;
  sessionName: string;
  sessionCode: string;
  sessionNumber: number;
  status: string;
  centre: Types.ObjectId;
}

const schema = new Schema<IExamSession>(
  {
    cbtExamination: { type: Schema.Types.ObjectId, name: "CBTExamination" },
    sessionName: { type: String, lowercase: true },
    sessionCode: { type: String, lowercase: true },
    sessionNumber: { type: Number },
    status: { type: String },
    centre: { type: Schema.Types.ObjectId, ref: "Centre" },
  },
  { timestamps: true },
);

schema.index({ cbtExamination: 1, sessionNumber: 1 }, { unique: true });

const ExamSessionModel = model("ExamSession", schema);

export default ExamSessionModel;
