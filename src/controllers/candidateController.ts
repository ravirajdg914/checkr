import { Request, Response, NextFunction } from "express";
import candidateService from "../services/candidateService";
import asyncHandler from "../utils/asyncHandler";
import { STATUS_CODES, MESSAGES } from "../utils/constants";

export const createCandidate = asyncHandler(
  async (req: Request, res: Response) => {
    const candidate = await candidateService.createCandidate(req.body);
    res.status(STATUS_CODES.CREATED).json(candidate);
  }
);

export const getCandidateById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const candidate = await candidateService.getCandidateById(Number(id));

    if (!candidate) {
      res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: MESSAGES.ERROR.CANDIDATE_NOT_FOUND });
      return;
    }

    res.status(STATUS_CODES.SUCCESS).json(candidate);
  }
);

export const updateCandidate = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const candidate = await candidateService.getCandidateById(Number(id));

        if (!candidate) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                message: MESSAGES.ERROR.CANDIDATE_NOT_FOUND,
            });
        }

        const updatedCandidate = await candidateService.updateCandidateById(Number(id), updateData);

        return res.status(STATUS_CODES.SUCCESS).json({
            message: MESSAGES.SUCCESS.CANDIDATE_UPDATED,
            candidate: updatedCandidate,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCandidate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await candidateService.deleteCandidateById(Number(id));
    res.status(STATUS_CODES.SUCCESS).json({
      message: MESSAGES.SUCCESS.CANDIDATE_DELETED,
    });
  }
);

export const getAllCandidates = asyncHandler(
  async (req: Request, res: Response) => {
    const candidates = await candidateService.getAllCandidates();
    res.status(STATUS_CODES.SUCCESS).json(candidates);
  }
);
