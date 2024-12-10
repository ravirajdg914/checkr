import express from "express";
import {
  createCandidate,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  getAllCandidates,
} from "../controllers/candidateController";
import { tokenMiddleware } from "../middlewares/authMiddleware";
import { createCandidateValidator } from "../validators/candidateValidator";

const router = express.Router();

router.get("/", tokenMiddleware, getAllCandidates);
router.get("/:id", tokenMiddleware, getCandidateById);
router.post("/", tokenMiddleware, createCandidateValidator, createCandidate);
router.put("/:id", tokenMiddleware, createCandidateValidator, updateCandidate);
router.delete("/:id", tokenMiddleware, deleteCandidate);

export default router;
