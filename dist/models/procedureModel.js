import { Schema, model } from "mongoose";
const schema = new Schema({
    programme: { type: Schema.Types.ObjectId, ref: "Programme" },
    name: { type: String, lowercase: true },
    code: { type: String, lowercase: true },
    requirements: String,
    instructions: String,
    items: [
        {
            question: String,
            questionId: String,
            options: [String],
            correctAnswer: String,
            order: Number,
        },
    ],
    activities: [
        {
            activity: String,
            score: Number,
            order: Number,
        },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "Account" },
    maxScore: { type: Number, default: 0 },
}, { timestamps: true });
schema.index({
    programme: 1,
    code: 1,
}, { unique: true });
const ProcedureModel = model("Procedure", schema);
export default ProcedureModel;
//# sourceMappingURL=procedureModel.js.map