import Candidate from "../models/candidateModel.js";
import ExamSessionModel from "../models/examSessionModel.js";
export const loginCandidate = async (req, res) => {
    try {
        await Candidate.findOne({ indexNumber: req.body.indexNumber });
    }
    catch (error) { }
};
export const preLoginCandidate = async (req, res) => {
    try {
        /**
         * check if there's an active examination
         * check if the registration number is correct
         * Check if the candidate is meant for that session
         * check if the candidate is already logged in
         * check if the ip address is already in use
         *
         */
        const candidate = await Candidate.findOne({
            indexNumber: req.body.indexNumber,
        });
        if (!candidate) {
            return res.status(400).send("Candidate not found");
        }
        if (candidate.examSession.toString() !== req.headers.examsession) {
            return res.status(400).send("Candidate not meant for this session");
        }
        if (candidate.loggedIn) {
            return res.status(400).send("Candidate already logged in");
        }
        if (candidate.ipAddress !== req.ip) {
            return res
                .status(400)
                .send("Candidate already logged in from another ip");
        }
        if (candidate.submitted) {
            return res.status(400).send("Candidate already submitted");
        }
        res.send(candidate);
    }
    catch (error) {
        res.status(500).send(new Error(error).message);
    }
};
export const examinationMiddleware = async (req, res, next) => {
    const result = await ExamSessionModel.aggregate([
        {
            $match: { status: "activated" },
        },
        {
            $lookup: {
                from: "cbtexaminations",
                localField: "cbtExamination",
                foreignField: "_id",
                as: "examination",
            },
        },
        {
            $unwind: "$examination",
        },
        {
            $match: {
                "examination.active": true,
            },
        },
        {
            $limit: 1,
        },
    ]);
    if (result.length < 0) {
        return res.status(400).send("No active examination");
    }
    req.headers.examsession = result[0]._id.toString();
    req.headers.cbtexamination = result[0].cbtExamination.toString();
    next();
};
//# sourceMappingURL=cbtController.js.map