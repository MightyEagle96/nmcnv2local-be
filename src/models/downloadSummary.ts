import { Schema, Types, model } from "mongoose";

type DownloadStatus = "pending" | "loading" | "success" | "error";

export interface IDownloadSummary {
  cbtExamination: Types.ObjectId;
  examination: DownloadStatus;
  programmes: DownloadStatus;
  questionBanks: DownloadStatus;
  sessions: DownloadStatus;
  candidates: DownloadStatus;
}

const downloadSummarySchema = new Schema<IDownloadSummary>(
  {
    cbtExamination: { type: Schema.Types.ObjectId, ref: "CBTExamination" },
    examination: { type: String, default: "pending" },
    programmes: { type: String, default: "pending" },
    questionBanks: { type: String, default: "pending" },
    sessions: { type: String, default: "pending" },
    candidates: { type: String, default: "pending" },
  },
  { timestamps: true },
);

downloadSummarySchema.index({ cbtExamination: 1 }, { unique: true });

const DownloadSummaryModel = model("DownloadSummary", downloadSummarySchema);

export default DownloadSummaryModel;
