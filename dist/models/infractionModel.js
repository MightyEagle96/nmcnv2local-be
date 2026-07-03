import { model, Schema } from "mongoose";
const schema = new Schema({
    candidate: { type: Schema.Types.ObjectId, ref: "Candidate" },
    cbtExamination: { type: Schema.Types.ObjectId, ref: "CBTExamination" },
    examSession: { type: Schema.Types.ObjectId, ref: "ExamSession" },
    infraction: { type: String },
    dateCreated: { type: Date, default: new Date() },
    dateModified: { type: Date, default: new Date() },
}, { timestamps: true });
const InfractionModel = model("Infraction", schema);
export default InfractionModel;
//# sourceMappingURL=infractionModel.js.map