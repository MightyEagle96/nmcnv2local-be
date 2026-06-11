// this model will hold all the available programmes for the candidates
import { Schema, model } from "mongoose";
const schema = new Schema({
    name: { type: String, lowercase: true },
    code: { type: String, lowercase: true },
    viva: { type: Number, default: 0 },
    procedure: { type: Number, default: 0 },
    research: { type: Number, default: 0 },
    clientCare: { type: Number, default: 0 },
    expectantFamilyCare: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "Account" },
}, { timestamps: true });
const ProgrammeModel = model("Programme", schema);
export default ProgrammeModel;
//# sourceMappingURL=programmeModel.js.map