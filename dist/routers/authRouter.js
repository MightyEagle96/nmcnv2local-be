import { Router } from "express";
import { getRefreshToken, myProfile } from "../controllers/authController.js";
import { authenticateToken } from "../controllers/jwtController.js";
const authRouter = Router();
authRouter
    .get("/profile", authenticateToken, myProfile)
    .get("/refresh", getRefreshToken);
export default authRouter;
//# sourceMappingURL=authRouter.js.map