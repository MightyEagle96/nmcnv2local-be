import { Schema, model } from "mongoose";

export interface ICentre {
  centreId: string;
  password: string;
}

const schema = new Schema<ICentre>({
  centreId: { type: String, required: true },
  password: { type: String, required: true },
});

schema.index({ centreId: 1 }, { unique: true });

export const Centre = model<ICentre>("Centre", schema);

export default Centre;
