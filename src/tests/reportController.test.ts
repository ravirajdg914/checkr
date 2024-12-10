import request from "supertest";
import app from "../app";
import reportService from "../services/reportService";
import {
  REPORT_VALIDATION_MESSAGES,
  REPORT_VALIDATION_STATUS_CODES,
} from "../utils/reportValidationConstants";

// Mock the reportService methods
jest.mock("../services/reportService");

// Mock the authentication middleware to bypass authentication
jest.mock("../middlewares/authMiddleware", () => ({
  tokenMiddleware: (req: any, res: any, next: any) => next(),
}));

describe("ReportController - POST /api/v1/reports/:candidateId", () => {
  const mockCandidateId = 1;
  const validReportData = {
    status: "clear",
    package: "Standard Package",
    adjudication: "Approved",
    turnaround_time: 48,
    completed_at: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a report successfully", async () => {
    (reportService.createReport as jest.Mock).mockResolvedValueOnce(
      validReportData
    );

    const response = await request(app)
      .post(`/api/v1/reports/${mockCandidateId}`)
      .send(validReportData)
      .expect(REPORT_VALIDATION_STATUS_CODES.CREATED);

    expect(response.body).toMatchObject(validReportData);
    expect(reportService.createReport).toHaveBeenCalledWith(
      mockCandidateId,
      validReportData
    );
  });

  it("should return validation error for missing status", async () => {
    const invalidReportData = { ...validReportData, status: undefined };

    const response = await request(app)
      .post(`/api/v1/reports/${mockCandidateId}`)
      .send(invalidReportData)
      .expect(REPORT_VALIDATION_STATUS_CODES.BAD_REQUEST);

    expect(response.body.errors).toContain(
      REPORT_VALIDATION_MESSAGES.STATUS.REQUIRED
    );
  });

  it("should return validation error for invalid status", async () => {
    const invalidReportData = { ...validReportData, status: "invalid_status" };

    const response = await request(app)
      .post(`/api/v1/reports/${mockCandidateId}`)
      .send(invalidReportData)
      .expect(REPORT_VALIDATION_STATUS_CODES.BAD_REQUEST);

    expect(response.body.errors).toContain(
      REPORT_VALIDATION_MESSAGES.STATUS.INVALID
    );
  });

  it("should return validation error for missing package", async () => {
    const invalidReportData = { ...validReportData, package: undefined };

    const response = await request(app)
      .post(`/api/v1/reports/${mockCandidateId}`)
      .send(invalidReportData)
      .expect(REPORT_VALIDATION_STATUS_CODES.BAD_REQUEST);

    expect(response.body.errors).toContain(
      REPORT_VALIDATION_MESSAGES.PACKAGE.REQUIRED
    );
  });

  it("should return validation error for invalid completed_at date", async () => {
    const invalidReportData = {
      ...validReportData,
      completed_at: "invalid_date",
    };

    const response = await request(app)
      .post(`/api/v1/reports/${mockCandidateId}`)
      .send(invalidReportData)
      .expect(REPORT_VALIDATION_STATUS_CODES.BAD_REQUEST);

    expect(response.body.errors).toContain(
      REPORT_VALIDATION_MESSAGES.COMPLETED_AT.INVALID
    );
  });
});

describe("ReportController - GET /api/v1/reports/:candidateId", () => {
  const mockCandidateId = 1;
  const mockReportData = {
    status: "clear",
    package: "Standard Package",
    adjudication: "Approved",
    turnaround_time: 48,
    completed_at: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve a report successfully", async () => {
    (reportService.getReportByCandidateId as jest.Mock).mockResolvedValueOnce(
      mockReportData
    );

    const response = await request(app)
      .get(`/api/v1/reports/${mockCandidateId}`)
      .expect(REPORT_VALIDATION_STATUS_CODES.SUCCESS);

    expect(response.body).toMatchObject(mockReportData);
    expect(reportService.getReportByCandidateId).toHaveBeenCalledWith(
      mockCandidateId
    );
  });

  it("should return not found error if report does not exist", async () => {
    (reportService.getReportByCandidateId as jest.Mock).mockResolvedValueOnce(
      null
    );

    const response = await request(app)
      .get(`/api/v1/reports/${mockCandidateId}`)
      .expect(REPORT_VALIDATION_STATUS_CODES.NOT_FOUND);

    expect(response.body.error).toBe("Report not found.");
    expect(reportService.getReportByCandidateId).toHaveBeenCalledWith(
      mockCandidateId
    );
  });
});

describe("ReportController - PUT /api/v1/reports/:candidateId", () => {
  const mockCandidateId = 1;
  const validReportData = {
    status: "clear",
    package: "Standard Package",
    adjudication: "Approved",
    turnaround_time: 48,
    completed_at: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a report successfully", async () => {
    (
      reportService.updateReportByCandidateId as jest.Mock
    ).mockResolvedValueOnce(validReportData);

    const response = await request(app)
      .put(`/api/v1/reports/${mockCandidateId}`)
      .send(validReportData)
      .expect(REPORT_VALIDATION_STATUS_CODES.SUCCESS);

    expect(response.body).toMatchObject(validReportData);
    expect(reportService.updateReportByCandidateId).toHaveBeenCalledWith(
      mockCandidateId,
      validReportData
    );
  });

  it("should return not found error if report does not exist", async () => {
    (
      reportService.updateReportByCandidateId as jest.Mock
    ).mockResolvedValueOnce(null);

    const response = await request(app)
      .put(`/api/v1/reports/${mockCandidateId}`)
      .send(validReportData)
      .expect(REPORT_VALIDATION_STATUS_CODES.NOT_FOUND);

    expect(response.body.error).toBe("Report not found.");
    expect(reportService.updateReportByCandidateId).toHaveBeenCalledWith(
      mockCandidateId,
      validReportData
    );
  });
});

describe("ReportController - DELETE /api/v1/reports/:candidateId", () => {
  const mockCandidateId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a report successfully", async () => {
    (
      reportService.deleteReportByCandidateId as jest.Mock
    ).mockResolvedValueOnce(true);

    const response = await request(app)
      .delete(`/api/v1/reports/${mockCandidateId}`)
      .expect(REPORT_VALIDATION_STATUS_CODES.SUCCESS);

    expect(response.body.message).toBe("Report deleted successfully.");
    expect(reportService.deleteReportByCandidateId).toHaveBeenCalledWith(
      mockCandidateId
    );
  });
});
