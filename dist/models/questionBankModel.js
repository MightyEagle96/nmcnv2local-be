import mongoose from "mongoose";
const { Schema, model } = mongoose;
const schema = new Schema({
    programme: { type: Schema.Types.ObjectId, ref: "Programme" },
    isTaken: { type: Boolean, default: false },
    dateCreated: { type: Date },
    dateTaken: Date,
    questions: [
        {
            question: String,
            questionId: String,
            options: [String],
            correctAnswer: String,
            startGroup: { type: Boolean, default: false },
            clustered: { type: Boolean, default: false },
            endGroup: { type: Boolean, default: false },
        },
    ],
}, { timestamps: true });
schema.pre("save", function (next) {
    this.dateCreated = new Date();
    next();
});
export default model("QuestionBank", schema);
//# sourceMappingURL=questionBankModel.js.map