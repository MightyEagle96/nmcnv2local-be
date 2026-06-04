import { Schema, model } from "mongoose";
const schema = new Schema({
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
export const Centre = model("Centre", schema);
export default Centre;
//# sourceMappingURL=centreModel.js.map