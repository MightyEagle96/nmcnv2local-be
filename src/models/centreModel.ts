import { Request } from "express";
import { Schema, model } from "mongoose";

export interface ICentre {
  _id?: string;
  centreId: string;
  password: string;
  active: boolean;
  role: string;
}

export interface AuthenticatedCentre extends Request {
  centre?: ICentre;
}
const schema = new Schema<ICentre>({
  role: { type: String, default: "admin" },
  centreId: { type: String, required: true },
  password: { type: String, required: true },
  active: { type: Boolean, default: true },
});

export const Centre = model<ICentre>("Centre", schema);

export default Centre;
