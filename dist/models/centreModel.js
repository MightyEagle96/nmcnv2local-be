import { Schema, model } from "mongoose";
const schema = new Schema({
    centreId: { type: String, required: true },
    password: { type: String, required: true },
});
schema.index({ centreId: 1 }, { unique: true });
export const Centre = model("Centre", schema);
export default Centre;
//# sourceMappingURL=centreModel.js.map