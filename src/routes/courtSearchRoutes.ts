import express from "express";
import {
  createCourtSearch,
  getAllCourtSearchesByCandidateId,
  getCourtSearchById,
  updateCourtSearchStatus,
  deleteCourtSearch,
} from "../controllers/courtSearchController";
import { tokenMiddleware } from "../middlewares/authMiddleware";
import { createCourtSearchValidator } from "../validators/courtSearchValidator";

const router = express.Router();

router.post(
  "/:candidateId",
  tokenMiddleware,
  createCourtSearchValidator,
  createCourtSearch
);
router.get("/candidate/:candidateId", tokenMiddleware, getAllCourtSearchesByCandidateId);
router.get("/:id", tokenMiddleware, getCourtSearchById);
router.patch("/:id", tokenMiddleware, updateCourtSearchStatus);
router.delete("/:id", tokenMiddleware, deleteCourtSearch);

export default router;
