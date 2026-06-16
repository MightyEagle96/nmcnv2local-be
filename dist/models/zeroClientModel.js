import { Schema, model } from "mongoose";
const schema = new Schema({
    active: { type: Boolean, default: false },
});
const ZeroClientModel = model("ZeroClient", schema);
export default ZeroClientModel;
//# sourceMappingURL=zeroClientModel.js.map