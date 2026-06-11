// this model will hold all the available programmes for the candidates
import { Schema, Types, model } from "mongoose";

export interface IProgramme {
  _id: Types.ObjectId;
  name: string;
  code: string;
  viva: number;
  procedure: number;
  research: number;
  clientCare: number;
  expectantFamilyCare: number;
  createdBy: Types.ObjectId;
}

const schema = new Schema<IProgramme>(
  {
    name: { type: String, lowercase: true },
    code: { type: String, lowercase: true },
    viva: { type: Number, default: 0 },
    procedure: { type: Number, default: 0 },
    research: { type: Number, default: 0 },
    clientCare: { type: Number, default: 0 },
    expectantFamilyCare: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "Account" },
  },
  { timestamps: true },
);

const ProgrammeModel = model("Programme", schema);

export default ProgrammeModel;
