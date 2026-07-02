import { Schema, Types, model } from "mongoose";

interface Response {
  programme: Types.ObjectId;
  questionBankId: Types.ObjectId;
  questionId: string;
  selectedAnswer: string;
}

interface IResponse {
  candidate: Types.ObjectId;
  cbtExamination: Types.ObjectId;
  examSession: Types.ObjectId;
  responses: Response[];
}

const schema = new Schema<IResponse>(
  {
    candidate: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    cbtExamination: {
      type: Schema.Types.ObjectId,
      ref: "CBTExamination",
      required: true,
    },
    examSession: {
      type: Schema.Types.ObjectId,
      ref: "ExamSession",
      required: true,
    },
    responses: [
      {
        programme: { type: Schema.Types.ObjectId, ref: "Programme" },
        questionBankId: { type: Schema.Types.ObjectId, ref: "QuestionBank" },
        questionId: String,
        selectedAnswer: String,
      },
    ],
  },
  { timestamps: true },
);

schema.index(
  { candidate: 1, cbtExamination: 1, examSession: 1 },
  { unique: true },
);

const ResponseModel = model("Response", schema);

export default ResponseModel;
