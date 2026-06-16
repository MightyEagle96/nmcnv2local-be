import { Schema, model } from "mongoose";

export interface IZeroClient {
  active: boolean;
}

const schema = new Schema<IZeroClient>({
  active: { type: Boolean, default: false },
});

const ZeroClientModel = model("ZeroClient", schema);

export default ZeroClientModel;
