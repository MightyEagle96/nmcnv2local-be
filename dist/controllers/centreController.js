import { httpService } from "../httpService.js";
import Centre from "../models/centreModel.js";
import { generateRefreshToken, generateToken, tokens, } from "./jwtController.js";
import CBTExamModel from "../models/cbtExaminationModel.js";
import Candidate from "../models/candidateModel.js";
const isProduction = process.env.NODE_ENV === "production";
export const LoginCentre = async (req, res) => {
    try {
        const result = await httpService.post("/server/login", req.body);
        if (result.status !== 200) {
            return res.status(result.status).send(result.data);
        }
        await Centre.updateMany({ active: true }, { $set: { active: false } });
        await Centre.updateOne({ _id: result.data._id }, { $set: { ...result.data, active: true } }, { upsert: true });
        const tokenData = {
            _id: result.data._id,
            centreId: result.data.centreId,
            password: result.data.password,
            role: "admin",
        };
        const accessToken = generateToken(tokenData);
        const refreshToken = generateRefreshToken(tokenData);
        res
            .cookie(tokens.auth_token, accessToken, {
            httpOnly: true,
            secure: isProduction, // 🔥 key fix
            sameSite: isProduction ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 24,
        })
            .cookie(tokens.refresh_token, refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        })
            .send("Logged In");
    }
    catch (error) {
        console.log(error);
        res.status(500).send(new Error(error).message);
    }
};
const appDashboard = async (req, res) => {
    const centre = await Centre.findOne({ active: true }).lean();
    if (!centre) {
        return res.sendStatus(401);
    }
    const [] = await Promise.all([
        CBTExamModel.countDocuments({ centre: centre._id }),
        Candidate.countDocuments({ centre: centre._id }),
        //ExamSession
    ]);
};
//# sourceMappingURL=centreController.js.map