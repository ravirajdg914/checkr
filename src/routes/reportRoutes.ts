import { Router } from "express";
import {
  createReport,
  deleteReportByCandidateId,
  getReportByCandidateId,
  updateReportByCandidateId,
} from "../controllers/reportController";
import { createReportValidator } from "../validators/reportValidator";
import { tokenMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post(
  "/:candidateId",
  tokenMiddleware,
  createReportValidator,
  createReport
);
router.get("/:candidateId", tokenMiddleware, getReportByCandidateId);
router.put(
  "/:candidateId",
  tokenMiddleware,
  createReportValidator,
  updateReportByCandidateId
);
router.delete("/:candidateId", tokenMiddleware, deleteReportByCandidateId);

export default router;
