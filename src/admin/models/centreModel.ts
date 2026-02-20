import { Schema, model } from "mongoose";

export interface ICentre {
  centreId: string;
  password: string;
}

const schema = new Schema<ICentre>({
  centreId: { type: String, required: true, lowercase: true },
  password: { type: String, required: true, lowercase: true },
});

const AdminModel = model<ICentre>("Centre", schema);

export default AdminModel;
