import CBTExamModel from "../models/cbtExaminationModel.js";
import ExamSessionModel from "../models/examSessionModel.js";
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
        await ExamSessionModel.updateOne({ _id, cbtExamination }, { $set: { status: "activated" } });
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
//# sourceMappingURL=examinationController.js.map