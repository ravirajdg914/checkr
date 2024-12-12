import reportService from "../services/reportService";
import Report from "../models/reportModel";
import Candidate from "../models/candidateModel";
import { CustomError } from "../utils/errorUtil";
import { MESSAGES, STATUS_CODES } from "../utils/constants";

// Mocking Sequelize Model Methods
jest.mock("../models/reportModel", () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
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

  describe("updateReport", () => {
    const mockReportData = {
      status: "clear",
      package: "basic",
      turnaround_time: 24,
    };

    it("should update a report successfully", async () => {
      const mockReport = {
        id: 1,
        ...mockReportData,
        update: jest.fn().mockImplementation(async function() {
          return {
            id: 1,
            ...mockReportData
          };
        }),
      };

      (Report.findByPk as jest.Mock).mockResolvedValue(mockReport);

      const result = await reportService.updateReport(1, mockReportData);

      expect(Report.findByPk).toHaveBeenCalledWith(1);
      expect(mockReport.update).toHaveBeenCalledWith(mockReportData);
      
      // Compare only the data properties, excluding the update function
      const { update, ...resultWithoutUpdate } = result;
      expect(resultWithoutUpdate).toEqual({ id: 1, ...mockReportData });
    });

    it("should throw an error if report is not found", async () => {
      (Report.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(reportService.updateReport(1, mockReportData)).rejects.toEqual(
        new CustomError(
          MESSAGES.ERROR.REPORT_NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        )
      );
    });
  });

  describe("deleteReport", () => {
    it("should delete a report successfully", async () => {
      const mockReport = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(undefined),
      };

      (Report.findByPk as jest.Mock).mockResolvedValue(mockReport);

      await reportService.deleteReport(1);

      expect(Report.findByPk).toHaveBeenCalledWith(1);
      expect(mockReport.destroy).toHaveBeenCalled();
    });

    it("should throw an error if report is not found", async () => {
      (Report.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(reportService.deleteReport(1)).rejects.toEqual(
        new CustomError(
          MESSAGES.ERROR.REPORT_NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        )
      );
    });
  });

  describe("getReportById", () => {
    it("should throw error if report is not found", async () => {
      (Report.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await expect(reportService.getReportById(1)).rejects.toEqual(
        new CustomError(
          MESSAGES.ERROR.REPORT_NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        )
      );
    });

    it("should retrieve a report successfully", async () => {
      const mockReport = {
        id: 1,
        status: "clear",
        package: "Standard Package",
        adjudication: "Approved",
        turnaround_time: 48,
        completed_at: new Date(),
      };

      (Report.findByPk as jest.Mock).mockResolvedValueOnce(mockReport);

      const report = await reportService.getReportById(1);

      expect(Report.findByPk).toHaveBeenCalledWith(1);
      expect(report).toEqual(mockReport);
    });
  });
});
