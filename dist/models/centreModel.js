import { Schema, model } from "mongoose";
const schema = new Schema({
    role: { type: String, default: "admin" },
    centreId: { type: String, required: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: true },
});
export const Centre = model("Centre", schema);
export default Centre;
//# sourceMappingURL=centreModel.js.map