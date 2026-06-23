import { Schema, model } from "mongoose";
const schema = new Schema({
    candidate: { type: Schema.Types.ObjectId, ref: "Candidate" },
    cbtExamination: { type: Schema.Types.ObjectId, ref: "CBTExamination" },
    examSession: { type: Schema.Types.ObjectId, ref: "ExamSession" },
    centre: { type: Schema.Types.ObjectId, ref: "Centre" },
    machineDetails: [
        {
            ipAddress: String,
            os: String,
            osVersion: String,
            browser: String,
            browerVersion: String,
            loginTime: Date,
            logoutTime: Date,
        },
    ],
}, { timestamps: true });
schema.index({ candidate: 1, cbtExamination: 1, examSession: 1 }, { unique: true });
const CandidateMachineModel = model("CandidateMachine", schema);
export default CandidateMachineModel;
//# sourceMappingURL=candidateMachine.js.map