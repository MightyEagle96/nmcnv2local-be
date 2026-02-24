import { Request } from "express";
import { Schema, Types, model } from "mongoose";

export interface ICentre {
  _id: Types.ObjectId;
  centreId: string;
  password: string;
  role: string;
}

export interface AuthenticatedCentre extends Request {
  centre?: ICentre;
}

const schema = new Schema<ICentre>({
  centreId: { type: String, required: true, lowercase: true },
  password: { type: String, required: true, lowercase: true },
});

const CentreModel = model<ICentre>("Centre", schema);

export default CentreModel;
