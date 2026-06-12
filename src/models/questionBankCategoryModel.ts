import mongoose, { Types } from "mongoose";
import { IQuestion, IQuestionBank } from "./questionBankModel.js";

const { Schema, model } = mongoose;

const schema = new Schema<IQuestionBank>(
  {
    programme: { type: Schema.Types.ObjectId, ref: "Programme" },
    questionBankCategory: { type: Number },
    questionBank: { type: Schema.Types.ObjectId, ref: "QuestionBank" },
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
  },
  { timestamps: true },
);

export default model("QuestionBankCategory", schema);
