// 1. Mock the candidateService before importing the controller
jest.mock("../services/candidateService", () => ({
  createCandidate: jest.fn(),
  getCandidateById: jest.fn(),
  updateCandidateById: jest.fn(),
  deleteCandidateById: jest.fn(),
  getAllCandidates: jest.fn(),
}));

// 2. Now import the controller functions and other dependencies
import {
  createCandidate,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  getAllCandidates,
} from "../controllers/candidateController";
import { Request, Response } from "express";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import candidateService from "../services/candidateService";
import { CustomError } from "../utils/errorUtil";

describe("CandidateController", () => {
  const mockRequest = (body = {}, params = {}, query = {}) =>
    ({
      body,
      params,
      query,
    } as unknown as Request);

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  describe("createCandidate", () => {
    it("should create a candidate and return 201 status", async () => {
      const req = mockRequest({
        name: "John Doe",
        email: "johndoe@example.com",
      });
      const res = mockResponse();
      const next = jest.fn();
      const candidate = {
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
      };

      (candidateService.createCandidate as jest.Mock).mockResolvedValueOnce(
        candidate
      );

      await createCandidate(req, res, next);

      expect(candidateService.createCandidate).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.CREATED);
      expect(res.json).toHaveBeenCalledWith(candidate);
    });
  });

  describe("getCandidateById", () => {
    it("should return a candidate and 200 status", async () => {
      const req = mockRequest({}, { id: "1" });
      const res = mockResponse();
      const next = jest.fn();
      const candidate = {
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
      };

      (candidateService.getCandidateById as jest.Mock).mockResolvedValueOnce(
        candidate
      );

      await getCandidateById(req, res, next);

      expect(candidateService.getCandidateById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS);
      expect(res.json).toHaveBeenCalledWith(candidate);
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle errors when candidate is not found", async () => {
      const req = mockRequest({}, { id: "1" });
      const res = mockResponse();
      const next = jest.fn();

      // Mock service to return null indicating not found
      (candidateService.getCandidateById as jest.Mock).mockResolvedValueOnce(
        null
      );

      await getCandidateById(req, res, next);

      expect(candidateService.getCandidateById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: MESSAGES.ERROR.CANDIDATE_NOT_FOUND,
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("deleteCandidate", () => {
    it("should delete a candidate and associated records and return 200 status", async () => {
      const req = mockRequest({}, { id: "1" });
      const res = mockResponse();
      const next = jest.fn();

      (candidateService.deleteCandidateById as jest.Mock).mockResolvedValueOnce(
        undefined
      );

      await deleteCandidate(req, res, next);

      expect(candidateService.deleteCandidateById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({
        message: MESSAGES.SUCCESS.CANDIDATE_DELETED,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle errors when deletion fails", async () => {
      const req = mockRequest({}, { id: "1" });
      const res = mockResponse();
      const next = jest.fn();

      const error = new CustomError(
        MESSAGES.ERROR.DELETE_CANDIDATE_FAILED,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );

      (candidateService.deleteCandidateById as jest.Mock).mockRejectedValueOnce(
        error
      );

      try {
        await deleteCandidate(req, res, next);
      } catch (err) {
        expect(candidateService.deleteCandidateById).toHaveBeenCalledWith(1);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(err).toEqual(error);
      }
    });
  });

  describe("getAllCandidates", () => {
    const mockRequest = (query = {}) => ({ query } as Request);
    const mockResponse = () => {
      const res = {} as Response;
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return paginated candidates and 200 status", async () => {
      const req = mockRequest({ page: "1" });
      const res = mockResponse();
      const next = jest.fn();

      const candidates = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `Candidate ${i + 1}`,
        email: `candidate${i + 1}@example.com`,
      }));

      (candidateService.getAllCandidates as jest.Mock).mockResolvedValueOnce(
        candidates
      );

      await getAllCandidates(req, res, next);

      expect(candidateService.getAllCandidates).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({
        totalCandidates: 25,
        totalPages: 3,
        currentPage: 1,
        candidates: candidates.slice(0, 10), // First page candidates
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return filtered candidates by name and 200 status", async () => {
      const req = mockRequest({ name: "John" });
      const res = mockResponse();
      const next = jest.fn();

      const candidates = [
        { id: 1, name: "John Doe", email: "johndoe@example.com" },
        { id: 2, name: "Jane Doe", email: "janedoe@example.com" },
      ];

      (candidateService.getAllCandidates as jest.Mock).mockResolvedValueOnce(
        candidates
      );

      await getAllCandidates(req, res, next);

      expect(candidateService.getAllCandidates).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({
        totalCandidates: 1,
        totalPages: 1,
        currentPage: 1,
        candidates: [candidates[0]], // Only John Doe matches
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 404 if no candidates match the search name", async () => {
      const req = mockRequest({ name: "Nonexistent" });
      const res = mockResponse();
      const next = jest.fn();

      const candidates = [
        { id: 1, name: "John Doe", email: "johndoe@example.com" },
        { id: 2, name: "Jane Doe", email: "janedoe@example.com" },
      ];

      (candidateService.getAllCandidates as jest.Mock).mockResolvedValueOnce(
        candidates
      );

      await getAllCandidates(req, res, next);

      expect(candidateService.getAllCandidates).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: MESSAGES.ERROR.NAME_NOT_FOUND,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 404 if page number is out of range", async () => {
      const req = mockRequest({ page: "5" });
      const res = mockResponse();
      const next = jest.fn();

      const candidates = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `Candidate ${i + 1}`,
        email: `candidate${i + 1}@example.com`,
      }));

      (candidateService.getAllCandidates as jest.Mock).mockResolvedValueOnce(
        candidates
      );

      await getAllCandidates(req, res, next);

      expect(candidateService.getAllCandidates).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: MESSAGES.ERROR.PAGE_OUT_OF_RANGE(5, 3),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle an empty list of candidates gracefully", async () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = jest.fn();

      (candidateService.getAllCandidates as jest.Mock).mockResolvedValueOnce(
        []
      );

      await getAllCandidates(req, res, next);

      expect(candidateService.getAllCandidates).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({
        totalCandidates: 0,
        totalPages: 0,
        currentPage: 1,
        candidates: [],
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("updateCandidate", () => {
    const updateData = {
      name: "John Updated",
      email: "johnupdated@example.com",
      dob: "1990-01-01",
      phone: "1234567890",
      zipcode: "12345",
      social_security: "123-45-6789",
      drivers_license: "DL123456",
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return 404 when candidate is not found", async () => {
      const req = mockRequest(updateData, { id: "1" });
      const res = mockResponse();
      const next = jest.fn();

      (candidateService.getCandidateById as jest.Mock).mockResolvedValue(null);

      await updateCandidate(req, res, next);

      expect(candidateService.getCandidateById).toHaveBeenCalledWith(1);
      expect(candidateService.updateCandidateById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: MESSAGES.ERROR.CANDIDATE_NOT_FOUND,
      });
    });

    it("should update a candidate and return 200 status", async () => {
      const req = mockRequest(updateData, { id: "1" });
      const res = mockResponse();
      const next = jest.fn();
      const candidate = {
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
      };

      const updatedCandidate = {
        ...candidate,
        ...updateData,
      };

      (candidateService.getCandidateById as jest.Mock).mockResolvedValueOnce(
        candidate
      );
      (candidateService.updateCandidateById as jest.Mock).mockResolvedValueOnce(
        updatedCandidate
      );

      await updateCandidate(req, res, next);

      expect(candidateService.getCandidateById).toHaveBeenCalledWith(1);
      expect(candidateService.updateCandidateById).toHaveBeenCalledWith(
        1,
        updateData
      );
      expect(res.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS);
      expect(res.json).toHaveBeenCalledWith({
        message: MESSAGES.SUCCESS.CANDIDATE_UPDATED,
        candidate: updatedCandidate,
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
