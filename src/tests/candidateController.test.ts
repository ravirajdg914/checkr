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

describe("CandidateController", () => {
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
    it("should delete a candidate and return 200 status", async () => {
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
  });

  describe("getAllCandidates", () => {
    it("should return all candidates and 200 status", async () => {
      const req = mockRequest();
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
      expect(res.json).toHaveBeenCalledWith(candidates);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
