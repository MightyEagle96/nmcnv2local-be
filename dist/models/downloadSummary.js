import { Schema, model } from "mongoose";
const downloadSummarySchema = new Schema({
    cbtExamination: { type: Schema.Types.ObjectId, ref: "CBTExamination" },
    examination: { type: String, default: "pending" },
    programmes: { type: String, default: "pending" },
    questionBanks: { type: String, default: "pending" },
    sessions: { type: String, default: "pending" },
    candidates: { type: String, default: "pending" },
}, { timestamps: true });
downloadSummarySchema.index({ cbtExamination: 1 }, { unique: true });
const DownloadSummaryModel = model("DownloadSummary", downloadSummarySchema);
export default DownloadSummaryModel;
//# sourceMappingURL=downloadSummary.js.map