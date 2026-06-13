import mongoose, { Types } from "mongoose";

const { Schema, model } = mongoose;

export interface IQuestion {
  question: string;
  questionId: string;
  options: string[];
  correctAnswer: string;
  startGroup: boolean;
  clustered: boolean;
  endGroup: boolean;
}

export interface IQuestionBank {
  programme: Types.ObjectId;
  isTaken: boolean;
  dateCreated: Date;
  questions: IQuestion[];
  dateTaken: Date;
  questionBankCategory?: number;
  questionBank?: Types.ObjectId;
}

const schema = new Schema<IQuestionBank>(
  {
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
  },
  { timestamps: true },
);
//export default model("QuestionBank", schema);

const QuestionBankModel = model<IQuestionBank>("QuestionBank", schema);
export default QuestionBankModel;
