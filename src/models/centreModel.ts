import { Request } from "express";
import { Schema, model } from "mongoose";

export interface ICentre {
  singleton: string;
  centreId: string;
  password: string;
  active: boolean;
  role: string;
}

export interface AuthenticatedCentre extends Request {
  centre?: ICentre;
}
const schema = new Schema<ICentre>({
  singleton: {
    type: String,
    default: "CENTRE",
    unique: true,
  },
  role: { type: String, default: "admin" },
  centreId: { type: String, required: true },
  password: { type: String, required: true },
});

schema.index({ singleton: 1 }, { unique: true });

export const Centre = model<ICentre>("Centre", schema);

export default Centre;
