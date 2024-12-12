import { Router } from "express";
import {
  createReport,
  deleteReport,
  getReportByCandidateId,
  updateReport,
  getReportById,
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
router.get("/:reportId", tokenMiddleware, getReportById);
router.put(
  "/:reportId",
  tokenMiddleware,
  createReportValidator,
  updateReport
);
router.delete("/:reportId", tokenMiddleware, deleteReport);

export default router;
