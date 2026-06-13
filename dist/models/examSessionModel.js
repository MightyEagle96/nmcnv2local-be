import { model, Schema } from "mongoose";
const schema = new Schema({
    cbtExamination: { type: Schema.Types.ObjectId, name: "CBTExamination" },
    sessionName: { type: String, lowercase: true },
    sessionCode: { type: String, lowercase: true },
    sessionNumber: { type: Number },
    status: { type: String },
    centre: { type: Schema.Types.ObjectId, ref: "Centre" },
}, { timestamps: true });
schema.index({ cbtExamination: 1, sessionNumber: 1 }, { unique: true });
const ExamSessionModel = model("ExamSession", schema);
export default ExamSessionModel;
//# sourceMappingURL=examSessionModel.js.map