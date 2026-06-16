import { model, Schema, Types } from "mongoose";

type status = "not started" | "activated" | "completed" | "uploaded";
interface IExamSession {
  cbtExamination: Types.ObjectId;
  sessionName: string;
  sessionCode: string;
  sessionNumber: number;
  status: status;
  centre: Types.ObjectId;
  activationTime: Date;
  completionTime: Date;
  uploadTime: Date;
}

const schema = new Schema<IExamSession>(
  {
    cbtExamination: { type: Schema.Types.ObjectId, ref: "CBTExamination" },

    sessionName: { type: String, lowercase: true },
    sessionCode: { type: String, lowercase: true },
    sessionNumber: { type: Number },
    status: { type: String, default: "not started" },
    centre: { type: Schema.Types.ObjectId, ref: "Centre" },
    activationTime: Date,
    completionTime: Date,
    uploadTime: Date,
  },
  { timestamps: true },
);

schema.index({ cbtExamination: 1, sessionNumber: 1 }, { unique: true });

const ExamSessionModel = model("ExamSession", schema);

export default ExamSessionModel;
