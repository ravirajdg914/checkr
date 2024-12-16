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

export const updateCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const candidate = await candidateService.getCandidateById(Number(id));

    if (!candidate) {
      res.status(STATUS_CODES.NOT_FOUND).json({
        message: MESSAGES.ERROR.CANDIDATE_NOT_FOUND,
      });
      return;
    }

    const updatedCandidate = await candidateService.updateCandidateById(
      Number(id),
      updateData
    );

    res.status(STATUS_CODES.SUCCESS).json({
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
    const { name, page = 1 } = req.query;

    // Fetch all candidates
    const candidates = await candidateService.getAllCandidates();

    // Filter candidates by name if the `name` query parameter is provided
    let filteredCandidates = name
      ? candidates.filter((candidate: any) =>
          candidate.name.toLowerCase().includes((name as string).toLowerCase())
        )
      : candidates;

    // If `name` is provided and no candidates match, return a name not found error
    if (name && filteredCandidates.length === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: MESSAGES.ERROR.NAME_NOT_FOUND,
      });
    }

    // Pagination logic
    const pageNumber = parseInt(page as string, 10);
    const pageSize = 10;
    const totalCandidates = filteredCandidates.length;
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

    // If page is out of range, return an error message
    if (paginatedCandidates.length === 0 && totalCandidates > 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: MESSAGES.ERROR.PAGE_OUT_OF_RANGE(
          pageNumber,
          Math.ceil(totalCandidates / pageSize)
        ),
      });
    }

    // Respond with paginated candidates and metadata
    res.status(STATUS_CODES.SUCCESS).json({
      totalCandidates,
      totalPages: Math.ceil(totalCandidates / pageSize),
      currentPage: pageNumber,
      candidates: paginatedCandidates,
    });
  }
);
