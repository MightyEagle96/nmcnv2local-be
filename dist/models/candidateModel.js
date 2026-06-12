import { Schema, model } from "mongoose";
const schema = new Schema({
    firstName: { type: String, lowercase: true, default: "" },
    middleName: { type: String, lowercase: true, default: "" },
    lastName: { type: String, lowercase: true, default: "" },
    indexNumber: { type: String, lowercase: true },
    cbtExamination: { type: Schema.Types.ObjectId, ref: "CBTExamination" },
    examSession: { type: Schema.Types.ObjectId, ref: "ExamSession" },
    programmes: [{ type: Schema.Types.ObjectId, ref: "Programme" }],
    error: { type: Boolean, default: false },
    invalidProgrammeIds: [{ type: Schema.Types.ObjectId, ref: "Programme" }],
    centre: { type: Schema.Types.ObjectId, ref: "Centre" },
    assignedToCentre: { type: Boolean, default: false },
    centreId: { type: String, lowercase: true },
    state: { type: String, lowercase: true },
    centreName: { type: String, lowercase: true },
    avatar: { type: String },
    school: { type: String, lowercase: true },
    synchronized: { type: Boolean },
    synchronizedTime: { type: Date },
    programmeCodes: String,
    duration: { type: Number, default: 0 },
    sessionId: { type: Number, default: 0 },
}, { timestamps: true });
schema.index({ indexNumber: 1, cbtExamination: 1, examSession: 1 }, { unique: true });
const Candidate = model("Candidate", schema);
export default Candidate;
//# sourceMappingURL=candidateModel.js.map