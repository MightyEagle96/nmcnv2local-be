import { model, Schema } from "mongoose";
const SessionDetail = new Schema({
    examSession: { type: Schema.Types.ObjectId, ref: "ExamSession" },
    timeDownloaded: Date,
    timeUploaded: Date,
    timeActivated: Date,
    timeEnded: Date,
    candidates: { type: Number, default: 0 },
    started: { type: Number, default: 0 },
    submitted: { type: Number, default: 0 },
});
const schema = new Schema({
    cbtExamination: { type: Schema.Types.ObjectId, ref: "CBTExamination" },
    centre: { type: Schema.Types.ObjectId, ref: "Centre" },
    downloadTime: Date,
    totalCandidates: { type: Number, default: 0 },
    sessions: [{ type: SessionDetail }],
    capacity: { type: Number, default: 0 },
}, { timestamps: true });
// Virtual status field
schema.virtual("status").get(function () {
    const hasUploaded = this.sessions?.some((s) => s.timeUploaded != null);
    if (hasUploaded)
        return "uploaded";
    const lastUpdate = this.updatedAt?.getTime() ?? 0;
    const now = Date.now();
    const diffInMinutes = (now - lastUpdate) / (1000 * 60);
    if (diffInMinutes <= 2)
        return "online";
    return "offline";
});
// Include virtuals
schema.set("toJSON", { virtuals: true });
schema.set("toObject", { virtuals: true });
schema.index({ cbtExamination: 1, centre: 1 }, { unique: true });
const ExamCentreModel = model("ExamCentre", schema);
export default ExamCentreModel;
//# sourceMappingURL=examCentreModel.js.map