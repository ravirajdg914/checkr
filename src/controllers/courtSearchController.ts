import { Request, Response } from "express";
import courtSearchService from "../services/courtSearchService";
import asyncHandler from "../utils/asyncHandler";
import { STATUS_CODES } from "../utils/constants";

export const createCourtSearch = asyncHandler(
  async (req: Request, res: Response) => {
    const candidateId = parseInt(req.params.candidateId, 10);
    const searchData = req.body;
    const courtSearch = await courtSearchService.createCourtSearch(
      candidateId,
      searchData
    );
    res.status(STATUS_CODES.CREATED).json(courtSearch);
  }
);

export const getCourtSearchesByCandidateId = asyncHandler(
  async (req: Request, res: Response) => {
    const candidateId = parseInt(req.query.candidateId as string, 10);
    const courtSearchId = req.query.courtSearchId
      ? parseInt(req.query.courtSearchId as string, 10)
      : null;

    if (isNaN(candidateId)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "Invalid candidate ID.",
      });
    }

    if (courtSearchId !== null && isNaN(courtSearchId)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "Invalid court search ID.",
      });
    }

    if (courtSearchId) {
      const courtSearch = await courtSearchService.getCourtSearchById(
        courtSearchId
      );
      res.status(STATUS_CODES.SUCCESS).json(courtSearch);
    } else {
      const courtSearches =
        await courtSearchService.getCourtSearchesByCandidateId(candidateId);
      res.status(STATUS_CODES.SUCCESS).json(courtSearches);
    }
  }
);

export const getAllCourtSearchesByCandidateId = asyncHandler(
  async (req: Request, res: Response) => {
    const candidateId = parseInt(req.params.candidateId, 10);
    const courtSearches = await courtSearchService.getCourtSearchesByCandidateId(candidateId);
    res.status(STATUS_CODES.SUCCESS).json(courtSearches);
  }
);

export const getCourtSearchById = asyncHandler(
  async (req: Request, res: Response) => {
    const courtSearchId = parseInt(req.params.id, 10);
    const courtSearch = await courtSearchService.getCourtSearchById(courtSearchId);
    res.status(STATUS_CODES.SUCCESS).json(courtSearch);
  }
);

export const updateCourtSearchStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const courtSearchId = parseInt(req.params.id, 10);
    const { status } = req.body;

    const updatedCourtSearch = await courtSearchService.updateCourtSearchStatus(
      courtSearchId,
      status
    );

    res.status(STATUS_CODES.SUCCESS).json(updatedCourtSearch);
  }
);

export const deleteCourtSearch = asyncHandler(
  async (req: Request, res: Response) => {
    const courtSearchId = parseInt(req.params.id, 10);
    await courtSearchService.deleteCourtSearch(courtSearchId);

    res.status(STATUS_CODES.SUCCESS).json({
      message: "Court search deleted successfully.",
    });
  }
);