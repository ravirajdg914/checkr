import { Request, Response } from "express";
import reportService from "../services/reportService";
import asyncHandler from "../utils/asyncHandler";
import { STATUS_CODES } from "../utils/constants";
import { REPORT_VALIDATION_STATUS_CODES } from "../utils/reportValidationConstants";

export const createReport = asyncHandler(
  async (req: Request, res: Response) => {
    const candidateId = parseInt(req.params.candidateId, 10);
    const reportData = req.body;
    const report = await reportService.createReport(candidateId, reportData);
    res.status(STATUS_CODES.CREATED).json(report);
  }
);

export const getReportByCandidateId = asyncHandler(
  async (req: Request, res: Response) => {
    const candidateId = parseInt(req.params.candidateId, 10);
    const report = await reportService.getReportByCandidateId(candidateId);

    if (!report) {
      return res
        .status(REPORT_VALIDATION_STATUS_CODES.NOT_FOUND)
        .json({ error: "Report not found." });
    }

    res.status(REPORT_VALIDATION_STATUS_CODES.SUCCESS).json(report);
  }
);

export const updateReport = asyncHandler(
  async (req: Request, res: Response) => {
    const reportId = parseInt(req.params.reportId, 10);
    const reportData = req.body;
    const updatedReport = await reportService.updateReport(reportId, reportData);

    if (!updatedReport) {
      return res
        .status(REPORT_VALIDATION_STATUS_CODES.NOT_FOUND)
        .json({ error: "Report not found." });
    }

    res.status(REPORT_VALIDATION_STATUS_CODES.SUCCESS).json(updatedReport);
  }
);

export const deleteReport = asyncHandler(
  async (req: Request, res: Response) => {
    const reportId = parseInt(req.params.reportId, 10);
    await reportService.deleteReport(reportId);

    res
      .status(REPORT_VALIDATION_STATUS_CODES.SUCCESS)
      .json({ message: "Report deleted successfully." });
  }
);

export const getReportById = asyncHandler(
  async (req: Request, res: Response) => {
    const reportId = parseInt(req.params.reportId, 10);
    const report = await reportService.getReportById(reportId);

    if (!report) {
      return res
        .status(REPORT_VALIDATION_STATUS_CODES.NOT_FOUND)
        .json({ error: "Report not found." });
    }

    res.status(REPORT_VALIDATION_STATUS_CODES.SUCCESS).json(report);
  }
);
