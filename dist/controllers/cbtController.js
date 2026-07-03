import Candidate from "../models/candidateModel.js";
import ExamSessionModel from "../models/examSessionModel.js";
import { appRoles, generateToken, tokens } from "./jwtController.js";
import { ConcurrentJobQueue } from "./DataQueue.js";
import * as UAParser from "ua-parser-js";
import CandidateMachineModel from "../models/candidateMachine.js";
import QuestionBankModel from "../models/questionBankModel.js";
import QuestionBankCategoryModel from "../models/questionBankCategoryModel.js";
import ResponseModel from "../models/responseModel.js";
const dataQueue = new ConcurrentJobQueue({
    concurrency: 1,
    maxQueueSize: 100,
    retries: 3,
    retryDelay: 1000,
    shutdownTimeout: 30000,
});
const responseQueue = new ConcurrentJobQueue({
    concurrency: 1,
    maxQueueSize: 100,
    retries: 3,
    retryDelay: 1000,
    shutdownTimeout: 30000,
});
export const loginCandidate = async (req, res) => {
    try {
        const parser = new UAParser.UAParser(req.headers["user-agent"]);
        const result = parser.getResult();
        const candidate = await Candidate.findById(req.query.candidate)
            .lean()
            .populate("programmes", { name: 1, code: 1 })
            .select({ avatar: 0 });
        if (!candidate) {
            return res.status(400).send("Candidate not found");
        }
        if (candidate.loggedIn) {
            return res.status(400).send("Candidate already logged in");
        }
        if (candidate.loggedIn && candidate.ipAddress !== req.ip) {
            return res
                .status(400)
                .send("Candidate already logged in from another ip");
        }
        if (candidate.submitted) {
            return res.status(400).send("Candidate already submitted");
        }
        const data = {
            name: `${candidate.firstName} ${candidate.middleName} ${candidate.lastName}`,
            indexNumber: candidate.indexNumber,
            programmes: candidate.programmes,
            duration: candidate.duration,
            role: appRoles.candidate,
            _id: candidate._id,
            school: candidate.school,
        };
        const accessToken = generateToken(data);
        res
            .cookie(tokens.auth_token, accessToken, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 6,
        })
            .send("Logged In");
        const ipAddress = req.ip?.replace("::ffff:", "");
        const cbtExamination = req.headers.cbtexamination;
        const examSession = req.headers.examsession;
        dataQueue.enqueue(async () => {
            const machineDetail = {
                ipAddress,
                os: result.os.name,
                osVersion: result.os.version,
                browser: result.browser.name,
                browserVersion: result.browser.version,
                loginTime: new Date(),
            };
            const update = {
                $set: {
                    ipAddress,
                    loggedIn: true,
                },
                $inc: {
                    loginCount: 1,
                },
            };
            if (!candidate.loggedInTime) {
                update.$set.loggedInTime = new Date();
            }
            await Candidate.updateOne({ _id: candidate._id }, update);
            await CandidateMachineModel.updateOne({
                candidate: candidate._id,
                cbtExamination,
                examSession,
            }, {
                $push: { machineDetails: machineDetail },
            }, { upsert: true });
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
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
            cbtExamination: req.headers.cbtexamination,
        }).populate("programmes", { name: 1, code: 1 });
        if (!candidate) {
            return res.status(400).send("Candidate not found");
        }
        if (candidate.examSession.toString() !== req.headers.examsession) {
            return res.status(400).send("Candidate not meant for this session");
        }
        if (candidate.loggedIn) {
            return res.status(400).send("Candidate already logged in");
        }
        if (candidate.loggedIn && candidate.ipAddress !== req.ip) {
            return res
                .status(400)
                .send("Candidate already logged in from another ip");
        }
        if (candidate.submitted) {
            return res.status(400).send("Candidate already submitted");
        }
        res.send({
            _id: candidate._id,
            avatar: candidate.avatar,
            name: `${candidate.firstName} ${candidate.middleName} ${candidate.lastName}`,
            indexNumber: candidate.indexNumber,
            programmes: candidate.programmes,
        });
    }
    catch (error) {
        res.status(500).send(new Error(error).message);
    }
};
export const examinationMiddleware = async (req, res, next) => {
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
        if (result.length < 0) {
            return res.status(400).send("No active examination");
        }
        req.headers.examsession = result[0]._id.toString();
        req.headers.cbtexamination = result[0].cbtExamination.toString();
        next();
    }
    catch (error) {
        return res.status(400).send("No active examination");
    }
};
export const instructionSummary = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.candidate?._id)
            .lean()
            .select({
            avatar: 0,
        })
            .populate("cbtExamination", { name: 1 });
        //.populate("programmes", { name: 1, code: 1, _id: 1 });
        if (!candidate) {
            return res.status(400).send("Candidate not found");
        }
        const questionBanks = await QuestionBankModel.find({
            programme: { $in: candidate.programmes },
        })
            .populate("programme", { name: 1 })
            .select({ questionsCount: 1, programme: 1 })
            .lean();
        const totalQuestions = questionBanks.reduce((a, b) => a + b.questionsCount, 0);
        res.send({
            examination: candidate.cbtExamination,
            duration: candidate.duration ? candidate.duration / (60 * 1000) : 0,
            questionBanks,
            totalQuestions,
        });
    }
    catch (error) {
        res.status(400).send(error);
    }
};
export const getAvatar = async (req, res) => {
    try {
        const avatar = await Candidate.findById(req.candidate?._id).select({
            avatar: 1,
        });
        res.send(avatar);
    }
    catch (error) {
        res.status(500).send("Error");
    }
};
export const getQuestions = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.candidate?._id);
        if (!candidate) {
            return res.status(400).send("Candidate not found");
        }
        const questionBanks = await QuestionBankCategoryModel.find({
            programme: { $in: candidate.programmes },
            questionBankCategory: candidate.questionCategory,
        })
            // .populate("programme", { name: 1 })
            // .select({ questionsCount: 1, programme: 1 })
            .lean();
        const responses = await ResponseModel.findOne({
            candidate: req.candidate?._id,
            cbtExamination: req.headers.cbtexamination,
            examSession: req.headers.examsession,
        });
        res.send({
            questionBanks,
            responses,
            duration: candidate.duration,
        });
    }
    catch (error) {
        res.sendStatus(500);
    }
};
export const saveResponses = async (req, res) => {
    try {
        const body = {
            candidate: req.candidate?._id,
            cbtExamination: req.headers.cbtexamination,
            examSession: req.headers.examsession,
            responses: req.body.responses,
            duration: req.body.duration,
        };
        responseQueue.enqueue(async () => {
            const result = await ResponseModel.updateOne({
                candidate: body.candidate,
                cbtExamination: body.cbtExamination,
                examSession: body.examSession,
                $expr: {
                    $lte: [{ $size: "$responses" }, body.responses.length],
                },
            }, {
                $set: {
                    responses: body.responses,
                },
            });
            if (result.matchedCount === 0) {
                try {
                    const response = new ResponseModel(body);
                    await response.save();
                    await Candidate.updateOne({
                        _id: body.candidate,
                    }, {
                        $set: {
                            duration: body.duration,
                            responseCount: body.responses.length,
                        },
                    });
                    return;
                }
                catch (error) {
                    if (error.code !== 11000) {
                        throw new Error("Response already submitted");
                    }
                    //throw error;
                }
            }
            const retry = await ResponseModel.updateOne({
                candidate: body.candidate,
                cbtExamination: body.cbtExamination,
                examSession: body.examSession,
                $expr: {
                    $lte: [{ $size: "$responses" }, body.responses.length],
                },
            }, {
                $set: {
                    responses: body.responses,
                },
            });
            if (result.modifiedCount > 0 || retry.modifiedCount > 0) {
                await Candidate.updateOne({
                    _id: body.candidate,
                }, {
                    $set: {
                        duration: body.duration,
                        responseCount: body.responses.length,
                    },
                });
            }
        });
        res.send("Response saved");
    }
    catch (error) {
        res.sendStatus(500);
    }
};
const submissionQueue = new ConcurrentJobQueue({
    concurrency: 1,
    maxQueueSize: 100,
    retries: 3,
    retryDelay: 1000,
    shutdownTimeout: 30000,
});
export const submitExam = async (req, res) => {
    try {
        const body = {
            candidate: req.candidate?._id,
            cbtExamination: req.headers.cbtexamination,
            examSession: req.headers.examsession,
            responses: req.body.responses,
            duration: req.body.duration,
        };
        submissionQueue.enqueue(async () => {
            const result = await ResponseModel.updateOne({
                candidate: body.candidate,
                cbtExamination: body.cbtExamination,
                examSession: body.examSession,
                $expr: {
                    $lte: [{ $size: "$responses" }, body.responses.length],
                },
            }, {
                $set: {
                    responses: body.responses,
                },
            });
            if (result.matchedCount === 0) {
                try {
                    const response = new ResponseModel(body);
                    await response.save();
                    await Candidate.updateOne({
                        _id: body.candidate,
                    }, {
                        $set: {
                            duration: body.duration,
                            responseCount: body.responses.length,
                            submitted: true,
                            submittedTime: new Date(),
                            ipAddress: "",
                            loggedIn: false,
                        },
                    });
                    return;
                }
                catch (error) {
                    if (error.code !== 11000) {
                        throw new Error("Response already submitted");
                    }
                    //throw error;
                }
            }
            const retry = await ResponseModel.updateOne({
                candidate: body.candidate,
                cbtExamination: body.cbtExamination,
                examSession: body.examSession,
                $expr: {
                    $lte: [{ $size: "$responses" }, body.responses.length],
                },
            }, {
                $set: {
                    responses: body.responses,
                },
            });
            if (result.modifiedCount > 0 || retry.modifiedCount > 0) {
                await Candidate.updateOne({
                    _id: body.candidate,
                }, {
                    $set: {
                        duration: body.duration,
                        responseCount: body.responses.length,
                        submitted: true,
                        submittedTime: new Date(),
                        ipAddress: "",
                        loggedIn: false,
                    },
                });
            }
        });
        res.send("Submitted");
    }
    catch (error) {
        res.sendStatus(500);
    }
};
//# sourceMappingURL=cbtController.js.map