// Mock the reportService before importing the controller
jest.mock("../services/reportService", () => ({
  createReport: jest.fn(),
  getReportByCandidateId: jest.fn(),
  updateReport: jest.fn(),
  deleteReport: jest.fn(),
  getReportById: jest.fn(),
}));

// Import the controller functions and dependencies
import {
  createReport,
  getReportByCandidateId,
  updateReport,
  deleteReport,
  getReportById,
} from "../controllers/reportController";
import { Request, Response } from "express";
import reportService from "../services/reportService";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import { REPORT_VALIDATION_STATUS_CODES } from "../utils/reportValidationConstants";

describe("ReportController", () => {
  const mockRequest = (body = {}, params = {}) =>
    ({
      body,
      params,
    } as Request);

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  describe("createReport", () => {
    it("should create a report and return 201 status", async () => {
      const req = mockRequest(
        { title: "Test Report", content: "Report details" },
        { candidateId: "1" }
      );
      const res = mockResponse();
      const next = jest.fn();
      const report = {
        id: 1,
        candidateId: 1,
        title: "Test Report",
        content: "Report details",
      };

      (reportService.createReport as jest.Mock).mockResolvedValueOnce(report);

      await createReport(req, res, next);

      expect(reportService.createReport).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.CREATED);
      expect(res.json).toHaveBeenCalledWith(report);
    });
  });

  describe("getReportByCandidateId", () => {
    it("should return a report and 200 status", async () => {
      const req = mockRequest({}, { candidateId: "1" });
      const res = mockResponse();
      const next = jest.fn();
      const report = {
        id: 1,
        candidateId: 1,
        title: "Test Report",
        content: "Report details",
      };

      (reportService.getReportByCandidateId as jest.Mock).mockResolvedValueOnce(
        report
      );

      await getReportByCandidateId(req, res, next);

      expect(reportService.getReportByCandidateId).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(
        REPORT_VALIDATION_STATUS_CODES.SUCCESS
      );
      expect(res.json).toHaveBeenCalledWith(report);
    });

    it("should handle errors when report is not found", async () => {
      const req = mockRequest({}, { candidateId: "1" });
      const res = mockResponse();
      const next = jest.fn();

      (reportService.getReportByCandidateId as jest.Mock).mockResolvedValueOnce(
        null
      );

      await getReportByCandidateId(req, res, next);

      expect(reportService.getReportByCandidateId).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(
        REPORT_VALIDATION_STATUS_CODES.NOT_FOUND
      );
      expect(res.json).toHaveBeenCalledWith({ error: "Report not found." });
    });
  });

  describe("updateReport", () => {
    it("should update a report and return 200 status", async () => {
      const req = mockRequest(
        { title: "Updated Report", content: "Updated details" },
        { reportId: "1" }
      );
      const res = mockResponse();
      const next = jest.fn();
      const updatedReport = {
        id: 1,
        title: "Updated Report",
        content: "Updated details",
      };

      (reportService.updateReport as jest.Mock).mockResolvedValueOnce(updatedReport);

      await updateReport(req, res, next);

      expect(reportService.updateReport).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(REPORT_VALIDATION_STATUS_CODES.SUCCESS);
      expect(res.json).toHaveBeenCalledWith(updatedReport);
    });

    it("should handle errors when report is not found", async () => {
      const req = mockRequest(
        { title: "Updated Report" },
        { reportId: "1" }
      );
      const res = mockResponse();
      const next = jest.fn();

      (reportService.updateReport as jest.Mock).mockResolvedValueOnce(null);

      await updateReport(req, res, next);

      expect(reportService.updateReport).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(REPORT_VALIDATION_STATUS_CODES.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ error: "Report not found." });
    });
  });

  describe("deleteReport", () => {
    it("should delete a report and return 200 status", async () => {
      const req = mockRequest({}, { reportId: "1" });
      const res = mockResponse();
      const next = jest.fn();

      (reportService.deleteReport as jest.Mock).mockResolvedValueOnce(undefined);

      await deleteReport(req, res, next);

      expect(reportService.deleteReport).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(REPORT_VALIDATION_STATUS_CODES.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({
        message: "Report deleted successfully.",
      });
    });
  });

  describe("getReportById", () => {
    it("should return a report and 200 status", async () => {
      const req = mockRequest({}, { reportId: "1" });
      const res = mockResponse();
      const next = jest.fn();
      const report = {
        id: 1,
        status: "clear",
        package: "Standard Package",
        adjudication: "Approved",
        turnaround_time: 48,
        completed_at: new Date(),
      };

      (reportService.getReportById as jest.Mock).mockResolvedValueOnce(report);

      await getReportById(req, res, next);

      expect(reportService.getReportById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(
        REPORT_VALIDATION_STATUS_CODES.SUCCESS
      );
      expect(res.json).toHaveBeenCalledWith(report);
    });

    it("should handle errors when report is not found", async () => {
      const req = mockRequest({}, { reportId: "1" });
      const res = mockResponse();
      const next = jest.fn();

      (reportService.getReportById as jest.Mock).mockResolvedValueOnce(null);

      await getReportById(req, res, next);

      expect(reportService.getReportById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(
        REPORT_VALIDATION_STATUS_CODES.NOT_FOUND
      );
      expect(res.json).toHaveBeenCalledWith({ error: "Report not found." });
    });
  });
});
