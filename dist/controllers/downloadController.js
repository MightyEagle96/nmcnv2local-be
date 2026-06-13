import Centre from "../models/centreModel.js";
import ExamSessionModel from "../models/examSessionModel.js";
import { httpService } from "../httpService.js";
import CBTExamModel from "../models/cbtExaminationModel.js";
import ProgrammeModel from "../models/programmeModel.js";
import { randomizeQuestionBank } from "./examRandomization.js";
import QuestionBankModel from "../models/questionBankModel.js";
import QuestionBankCategoryModel from "../models/questionBankCategoryModel.js";
import Candidate from "../models/candidateModel.js";
import DownloadSummaryModel from "../models/downloadSummary.js";
export const authenticateCentre = async (req, res, next) => {
    try {
        const centre = await Centre.findOne({
            active: true,
        }).lean();
        if (!centre) {
            res.sendStatus(401);
            return;
        }
        req.headers.centreid = centre._id.toString();
        next();
    }
    catch (error) {
        res.sendStatus(401);
    }
};
export const downloadExamination = async (req, res) => {
    try {
        const response = await httpService.get("server/download/examination", {
            headers: { centreid: req.headers.centreid },
        });
        if (response.status !== 200) {
            return res.status(response.status).send(response.data);
        }
        const { _id, ...rest } = response.data;
        await CBTExamModel.updateMany({ active: true }, { $set: { active: false } });
        await CBTExamModel.updateOne({ _id }, { $set: { ...rest } }, {
            upsert: true,
        });
        await DownloadSummaryModel.updateOne({ cbtExamination: _id }, { $set: { examination: "success" } }, { upsert: true });
        res.send("Examination downloaded");
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Error downloading examination");
    }
};
export const downloadProgrammes = async (req, res) => {
    const activeExamination = await CBTExamModel.findOne({
        active: true,
    });
    if (!activeExamination) {
        return res.status(400).send("No active examination downloaded");
    }
    try {
        const response = await httpService.get("server/download/programmes", {
            headers: { centreid: req.headers.centreid },
        });
        if (response.status !== 200) {
            return res.status(response.status).send(response.data);
        }
        const programmes = response.data;
        await ProgrammeModel.deleteMany({});
        await ProgrammeModel.insertMany(programmes, { ordered: false });
        await DownloadSummaryModel.updateOne({ cbtExamination: activeExamination._id }, { $set: { programmes: "success" } }, { upsert: true });
        res.send("Programmes downloaded");
    }
    catch (error) {
        console.log(error);
        await DownloadSummaryModel.updateOne({ cbtExamination: activeExamination._id }, { $set: { programmes: "error" } }, { upsert: true });
        res.status(500).send("Error downloading programmes");
    }
};
export const downloadQuestionBanks = async (req, res) => {
    const activeExamination = await CBTExamModel.findOne({
        active: true,
    });
    if (!activeExamination) {
        return res.status(400).send("No active examination downloaded");
    }
    try {
        const response = await httpService.get("server/download/questionbanks", {
            headers: { centreid: req.headers.centreid },
        });
        if (response.status !== 200) {
            return res.status(response.status).send(response.data);
        }
        const downloadedQuestionBanks = response.data;
        await QuestionBankModel.deleteMany({});
        await QuestionBankCategoryModel.deleteMany({});
        for (const questionBank of downloadedQuestionBanks) {
            const rootQuestionBank = await QuestionBankModel.create(questionBank);
            const categories = Array.from({ length: 10 }, (_, index) => ({
                ...randomizeQuestionBank(questionBank),
                questionBank: rootQuestionBank._id,
                questionBankCategory: index + 1,
            }));
            await QuestionBankCategoryModel.insertMany(categories);
        }
        await DownloadSummaryModel.updateOne({ cbtExamination: activeExamination._id }, { $set: { questionBanks: "success" } }, { upsert: true });
        res.send("Question banks downloaded");
    }
    catch (error) {
        console.log(error);
        await DownloadSummaryModel.updateOne({ cbtExamination: activeExamination._id }, { $set: { questionBanks: "error" } }, { upsert: true });
        res.status(500).send("Error downloading question banks");
    }
};
export const downloadExamSessions = async (req, res) => {
    const activeExamination = await CBTExamModel.findOne({
        active: true,
    });
    if (!activeExamination) {
        return res.status(400).send("No active examination downloaded");
    }
    try {
        const response = await httpService.get("server/download/sessions", {
            headers: { centreid: req.headers.centreid },
        });
        if (response.status !== 200) {
            return res.status(response.status).send(response.data);
        }
        await ExamSessionModel.insertMany(response.data, { ordered: false });
        res.send("Examination sessions downloaded");
        await DownloadSummaryModel.updateOne({ cbtExamination: activeExamination._id }, { $set: { sessions: "success" } }, { upsert: true });
    }
    catch (error) {
        if (error.code === 11000) {
            await DownloadSummaryModel.updateOne({ cbtExamination: activeExamination._id }, { $set: { sessions: "success" } }, { upsert: true });
            return res.send("Examination sessions already downloaded");
        }
        await DownloadSummaryModel.updateOne({ cbtExamination: activeExamination._id }, { $set: { sessions: "error" } }, { upsert: true });
        res.status(500).send("Error downloading examination sessions");
    }
};
export const downloadCandidates = async (req, res) => {
    const activeExamination = await CBTExamModel.findOne({
        active: true,
    });
    if (!activeExamination) {
        return res.status(400).send("No active examination downloaded");
    }
    try {
        const activeExamination = await CBTExamModel.findOne({
            active: true,
        }).lean();
        if (!activeExamination) {
            return res.status(400).send("No active examination downloaded");
        }
        const examSessions = await ExamSessionModel.find({
            cbtExamination: activeExamination._id,
        }).lean();
        if (examSessions.length === 0) {
            return res.status(400).send("No active examination sessions downloaded");
        }
        for (const examSession of examSessions) {
            const response = await httpService.get("server/download/candidates", {
                headers: {
                    centreid: req.headers.centreid,
                    examsession: examSession._id.toString(),
                },
            });
            if (response.status !== 200) {
                res.status(response.status).send(response.data);
                break;
            }
            await Candidate.insertMany(response.data, { ordered: false });
        }
        const candidates = await Candidate.find({
            cbtExamination: activeExamination._id,
        }).select("_id");
        const shuffled = candidates.sort(() => Math.random() - 0.5);
        const updates = shuffled.map((candidate, index) => ({
            updateOne: {
                filter: { _id: candidate._id },
                update: {
                    $set: {
                        questionCategory: (index % 10) + 1,
                    },
                },
            },
        }));
        await Candidate.bulkWrite(updates);
        await DownloadSummaryModel.updateOne({ cbtExamination: activeExamination._id }, { $set: { candidates: "success" } }, { upsert: true });
        res.send("Candidates downloaded");
    }
    catch (error) {
        if (error.code === 11000) {
            await DownloadSummaryModel.updateOne({ cbtExamination: activeExamination._id }, { $set: { candidates: "success" } }, { upsert: true });
            return res.send("Candidates already downloaded  ");
        }
        await DownloadSummaryModel.updateOne({ cbtExamination: activeExamination._id }, { $set: { candidates: "error" } }, { upsert: true });
        res.status(500).send("Error downloading candidates");
    }
};
export const downloadSummary = async (req, res) => {
    const activeExamination = await CBTExamModel.findOne({
        active: true,
    });
    if (!activeExamination) {
        return res.status(400).send("No active examination downloaded");
    }
    const summary = await DownloadSummaryModel.findOne({
        cbtExamination: activeExamination._id,
    });
    res.send(summary);
};
//# sourceMappingURL=downloadController.js.map