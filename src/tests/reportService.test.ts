import reportService from "../services/reportService";
import Report from "../models/reportModel";
import Candidate from "../models/candidateModel";
import { CustomError } from "../utils/errorUtil";
import { MESSAGES, STATUS_CODES } from "../utils/constants";

// Mocking Sequelize Model Methods
jest.mock("../models/reportModel", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

jest.mock("../models/candidateModel", () => ({
  findByPk: jest.fn(),
}));

describe("ReportService", () => {
  const mockCandidateId = 1;
  const mockReportData = {
    status: "clear",
    package: "Standard Package",
    adjudication: "Approved",
    turnaround_time: 48,
    completed_at: new Date(),
  };

  describe("createReport", () => {
    it("should throw error if candidate is not found", async () => {
      (Candidate.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        reportService.createReport(mockCandidateId, mockReportData)
      ).rejects.toEqual(
        new CustomError(
          MESSAGES.ERROR.CANDIDATE_NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        )
      );
    });

    it("should throw error if report already exists", async () => {
      (Candidate.findByPk as jest.Mock).mockResolvedValueOnce({});
      (Report.findOne as jest.Mock).mockResolvedValueOnce({});

      await expect(
        reportService.createReport(mockCandidateId, mockReportData)
      ).rejects.toEqual(
        new CustomError(
          MESSAGES.ERROR.REPORT_ALREADY_EXISTS,
          STATUS_CODES.BAD_REQUEST
        )
      );
    });

    it("should create a report successfully", async () => {
      (Candidate.findByPk as jest.Mock).mockResolvedValueOnce({});
      (Report.findOne as jest.Mock).mockResolvedValueOnce(null);
      (Report.create as jest.Mock).mockResolvedValueOnce(mockReportData);

      const report = await reportService.createReport(
        mockCandidateId,
        mockReportData
      );

      expect(report).toEqual(mockReportData);
    });
  });

  describe("getReportByCandidateId", () => {
    it("should throw error if report is not found", async () => {
      (Report.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        reportService.getReportByCandidateId(mockCandidateId)
      ).rejects.toEqual(
        new CustomError(MESSAGES.ERROR.REPORT_NOT_FOUND, STATUS_CODES.NOT_FOUND)
      );
    });

    it("should retrieve a report successfully", async () => {
      (Report.findOne as jest.Mock).mockResolvedValueOnce(mockReportData);

      const report = await reportService.getReportByCandidateId(
        mockCandidateId
      );

      expect(report).toEqual(mockReportData);
    });
  });

  describe("updateReportByCandidateId", () => {
    it("should throw error if report is not found", async () => {
      (Report.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        reportService.updateReportByCandidateId(mockCandidateId, mockReportData)
      ).rejects.toEqual(
        new CustomError(MESSAGES.ERROR.REPORT_NOT_FOUND, STATUS_CODES.NOT_FOUND)
      );
    });

    it("should update a report successfully", async () => {
      const mockReport = {
        ...mockReportData,
        update: jest.fn().mockResolvedValueOnce(mockReportData),
      };
      (Report.findOne as jest.Mock).mockResolvedValueOnce(mockReport);

      const updatedReport = await reportService.updateReportByCandidateId(
        mockCandidateId,
        mockReportData
      );

      expect(updatedReport).toMatchObject(mockReportData);
      expect(mockReport.update).toHaveBeenCalledWith(mockReportData);
    });
  });

  describe("deleteReportByCandidateId", () => {
    it("should throw error if report is not found", async () => {
      (Report.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        reportService.deleteReportByCandidateId(mockCandidateId)
      ).rejects.toEqual(
        new CustomError(MESSAGES.ERROR.REPORT_NOT_FOUND, STATUS_CODES.NOT_FOUND)
      );
    });

    it("should delete a report successfully", async () => {
      const mockReport = { destroy: jest.fn().mockResolvedValueOnce(null) };
      (Report.findOne as jest.Mock).mockResolvedValueOnce(mockReport);

      await reportService.deleteReportByCandidateId(mockCandidateId);

      expect(mockReport.destroy).toHaveBeenCalled();
    });
  });
});
