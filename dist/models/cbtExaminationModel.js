import { Schema, model } from "mongoose";
const cbtExaminationSchema = new Schema({
    name: { type: String, required: true, lowercase: true },
    programmes: [{ type: Schema.Types.ObjectId, ref: "Programme" }],
    dateCreated: { type: Date, default: new Date() },
    active: { type: Boolean, default: false },
    concluded: { type: Boolean, default: false },
    questionBanks: [
        {
            programme: { type: Schema.Types.ObjectId, ref: "Programme" },
            questionBank: { type: Schema.Types.ObjectId, ref: "QuestionBank" },
        },
    ],
    duration: { type: Number, default: 60 * 60 * 1000 },
    scheduledTime: Date,
    downloadTime: Date,
    createdBy: { type: Schema.Types.ObjectId, ref: "Account" },
    centre: { type: Schema.Types.ObjectId, ref: "Centre" },
}, { timestamps: true });
const CBTExamModel = model("CBTExamination", cbtExaminationSchema);
export default CBTExamModel;
//# sourceMappingURL=cbtExaminationModel.js.map