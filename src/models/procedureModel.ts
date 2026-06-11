import { Schema, Types, model } from "mongoose";

interface IProcedure {
  programme: Types.ObjectId;
  name: string;
  code: string;
  requirements: string;
  instructions: string;
  items: {
    question: string;
    questionId: string;
    options: string[];
    correctAnswer: string;
    order: number;
  }[];
  activities: {
    activity: string;
    score: number;
    order: number;
  }[];
  maxScore: number;
  createdBy: Types.ObjectId;
}

const schema = new Schema<IProcedure>(
  {
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
  },
  { timestamps: true },
);

schema.index(
  {
    programme: 1,
    code: 1,
  },
  { unique: true },
);

const ProcedureModel = model("Procedure", schema);

export default ProcedureModel;

export { IProcedure };
