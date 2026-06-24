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
    questionsCount: { type: Number, default: 0 },
}, { timestamps: true });
//export default model("QuestionBank", schema);
schema.pre("save", function () {
    this.questionsCount = this.questions.length;
});
const QuestionBankModel = model("QuestionBank", schema);
export default QuestionBankModel;
//# sourceMappingURL=questionBankModel.js.map