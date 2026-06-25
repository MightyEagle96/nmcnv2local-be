import CBTExamModel from "../models/cbtExaminationModel.js";
import ExamSessionModel from "../models/examSessionModel.js";
import Candidate from "../models/candidateModel.js";
import { io } from "../app.js";
import { tokens } from "./jwtController.js";
export const GetExaminationsWithSessions = async (req, res) => {
    try {
        const examinations = await CBTExamModel.aggregate([
            {
                $lookup: {
                    from: "examsessions", // collection name
                    localField: "_id",
                    foreignField: "cbtExamination",
                    as: "sessions",
                },
            },
            {
                $addFields: {
                    activatedSession: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$sessions",
                                    as: "session",
                                    cond: {
                                        $eq: ["$$session.status", "activated"],
                                    },
                                },
                            },
                            0,
                        ],
                    },
                },
            },
            {
                $project: {
                    name: 1,
                    active: 1,
                    scheduledTime: 1,
                    sessions: {
                        _id: 1,
                        sessionName: 1,
                        sessionCode: 1,
                        sessionNumber: 1,
                        status: 1,
                        cbtExamination: 1,
                    },
                    activatedSession: {
                        _id: 1,
                        sessionName: 1,
                        sessionCode: 1,
                        sessionNumber: 1,
                        status: 1,
                        cbtExamination: 1,
                    },
                },
            },
            {
                $sort: {
                    scheduledTime: 1,
                },
            },
        ]);
        console.log(examinations);
        res.send(examinations);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
export const activateSession = async (req, res) => {
    try {
        const { _id, cbtExamination } = req.body;
        const examination = await CBTExamModel.findOne({ _id: cbtExamination });
        if (!examination) {
            return res.status(400).send("Examination not found");
        }
        else if (!examination.active) {
            return res.status(400).send("Examination not active");
        }
        await ExamSessionModel.updateOne({ _id, cbtExamination }, { $set: { status: "activated" } });
        await Candidate.updateMany({ cbtExamination, examSession: _id }, { $set: { duration: examination.duration } });
        // console.log(result);
        res.send("Session activated");
    }
    catch (error) {
        res.status(500).send(error);
    }
};
export const activeExaminationAndSession = async (req, res) => {
    try {
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
        if (!result.length) {
            //res.status(404).send({ message: "No active session found" });
            res.send(null);
            return;
        }
        res.send(result[0]);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
export const viewSessionCandidates = async (req, res) => {
    try {
        const page = (req.query.page || 1);
        const limit = (req.query.limit || 50);
        const totalCandidates = await Candidate.countDocuments({
            cbtExamination: req.headers.cbtexamination,
            examSession: req.headers.examsession,
        });
        const candidates = await Candidate.find({
            cbtExamination: req.headers.cbtexamination,
            examSession: req.headers.examsession,
        })
            .sort({ indexNumber: 1, firstName: 1, lastName: 1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select({
            firstName: 1,
            middleName: 1,
            lastName: 1,
            indexNumber: 1,
            loggedInTime: 1,
            submitted: 1,
            submittedTime: 1,
            ipAddress: 1,
            loginCount: 1,
        })
            .lean();
        const mappedRecords = candidates.map((candidate, i) => {
            return {
                ...candidate,
                id: (page - 1) * limit + i + 1,
            };
        });
        res.send({
            candidates: mappedRecords,
            totalCandidates,
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
};
export const getCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({
            indexNumber: req.body.indexNumber,
            cbtExamination: req.headers.cbtexamination,
            examSession: req.headers.examsession,
        })
            .lean()
            .select({
            avatar: 1,
            indexNumber: 1,
            firstName: 1,
            middleName: 1,
            lastName: 1,
            submitted: 1,
            flaggedForInfraction: 1,
            loggedIn: 1,
        });
        if (!candidate) {
            return res.status(400).send("Candidate not found");
        }
        if (candidate.submitted === true) {
            return res.status(400).send("Candidate already submitted");
        }
        if (!candidate.loggedIn) {
            return res.status(400).send("Candidate not logged in");
        }
        if (candidate.flaggedForInfraction) {
            return res.status(400).send("Candidate has been flagged for infraction");
        }
        res.send(candidate);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
export const reloginCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({
            indexNumber: req.body.indexNumber,
            cbtExamination: req.headers.cbtexamination,
            examSession: req.headers.examsession,
        });
        if (!candidate) {
            return res.status(400).send("Candidate not found");
        }
        await Candidate.updateOne({ _id: candidate._id }, { $set: { loggedIn: false, ipAddress: "" } });
        res.send("Candidate relogged in");
    }
    catch (error) {
        res.status(500).send(error);
    }
};
export const testWebSocket = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({
            indexNumber: req.body.indexNumber,
            cbtExamination: req.headers.cbtexamination,
        });
        if (!candidate) {
            return res.status(400).send("Candidate not found");
        }
        io.to(`candidate:${candidate._id}`).emit("test", "test");
        res.send("Candidate relogged in");
    }
    catch (error) {
        console.error(error);
    }
};
export const clearCookie = async (req, res) => {
    res
        .clearCookie(tokens.auth_token)
        .clearCookie(tokens.refresh_token)
        .send("Logged Out");
};
//# sourceMappingURL=examinationController.js.map