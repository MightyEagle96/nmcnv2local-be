import Candidate from "../models/candidateModel.js";
export const loginCandidate = async (req, res) => {
    try {
        await Candidate.findOne({ indexNumber: req.body.indexNumber });
    }
    catch (error) { }
};
export const preLoginCandidate = async (req, res) => {
    try {
    }
    catch (error) { }
};
//# sourceMappingURL=cbtController.js.map