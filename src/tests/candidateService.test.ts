import candidateService from "../services/candidateService";
import Candidate from "../models/candidateModel";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { CustomError } from "../utils/errorUtil";
import Report from "../models/reportModel";
import CourtSearch from "../models/courtSearchModel";

jest.mock("../models/candidateModel", () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  findAll: jest.fn(),
}));

jest.mock("../models/reportModel", () => ({
  destroy: jest.fn(),
}));

jest.mock("../models/courtSearchModel", () => ({
  destroy: jest.fn(),
}));

describe("CandidateService", () => {
  const mockCandidate = {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    dob: new Date(),
    phone: "1234567890",
    zipcode: "12345",
    social_security: "123-45-6789",
    drivers_license: "D1234567",
  };

  describe("createCandidate", () => {
    it("should throw error if email is already taken", async () => {
      (Candidate.findOne as jest.Mock).mockResolvedValueOnce(mockCandidate);

      try {
        await candidateService.createCandidate(mockCandidate);
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect(error).toEqual(
          expect.objectContaining({
            message: MESSAGES.ERROR.EMAIL_TAKEN,
            status: STATUS_CODES.BAD_REQUEST,
          })
        );
      }
    });

    it("should successfully create a new candidate", async () => {
      (Candidate.findOne as jest.Mock).mockResolvedValueOnce(null);
      (Candidate.create as jest.Mock).mockResolvedValueOnce(mockCandidate);

      const result = await candidateService.createCandidate(mockCandidate);

      expect(result).toEqual(mockCandidate);
    });
  });

  describe("getCandidateById", () => {
    it("should throw error if candidate not found", async () => {
      (Candidate.findByPk as jest.Mock).mockResolvedValueOnce(null);

      try {
        await candidateService.getCandidateById(1);
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect(error).toEqual(
          expect.objectContaining({
            message: MESSAGES.ERROR.CANDIDATE_NOT_FOUND,
            status: STATUS_CODES.NOT_FOUND,
          })
        );
      }
    });

    it("should return candidate if found", async () => {
      (Candidate.findByPk as jest.Mock).mockResolvedValueOnce(mockCandidate);

      const result = await candidateService.getCandidateById(1);

      expect(result).toEqual(mockCandidate);
    });
  });

  describe("updateCandidateById", () => {
    it("should throw error if candidate not found", async () => {
      (Candidate.findByPk as jest.Mock).mockResolvedValueOnce(null);

      try {
        await candidateService.updateCandidateById(1, { name: "Jane Doe" });
      } catch (error: any) {
        expect(error.message).toBe(MESSAGES.ERROR.CANDIDATE_NOT_FOUND);
      }
    });

    it("should update candidate if found", async () => {
      type CandidateMock = typeof mockCandidate & { update: jest.Mock };

      const mockCandidateWithUpdate: CandidateMock = {
        ...mockCandidate,
        update: jest.fn(function (
          this: CandidateMock,
          updatedData: Partial<CandidateMock>
        ) {
          Object.assign(this, updatedData);
          return Promise.resolve(this);
        }),
      };

      // Mock `findByPk` to return the candidate with the `update` method
      (Candidate.findByPk as jest.Mock).mockResolvedValueOnce(
        mockCandidateWithUpdate
      );

      const updatedData = { name: "Jane Doe" };
      const result = await candidateService.updateCandidateById(1, updatedData);

      // Check if `update` was called with the correct data
      expect(mockCandidateWithUpdate.update).toHaveBeenCalledWith(updatedData);

      // Remove the `update` method from the result before comparison
      const { update, ...resultWithoutUpdate } = result as any;

      // Check if the result matches the updated data
      expect(resultWithoutUpdate).toEqual({
        ...mockCandidate,
        ...updatedData,
      });
    });
  });

  describe("deleteCandidateById", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw error if candidate not found", async () => {
      (Candidate.findByPk as jest.Mock).mockResolvedValueOnce(null);

      try {
        await candidateService.deleteCandidateById(1);
      } catch (error: any) {
        expect(error).toBeInstanceOf(CustomError);
        expect(error.message).toBe(MESSAGES.ERROR.CANDIDATE_NOT_FOUND);
      }
    });

    it("should delete candidate and associated records if found", async () => {
      // Mock candidate
      (Candidate.findByPk as jest.Mock).mockResolvedValueOnce({
        ...mockCandidate,
        destroy: jest.fn().mockResolvedValueOnce(undefined),
      });

      // Mock associated records deletion
      (Report.destroy as jest.Mock).mockResolvedValueOnce(undefined);
      (CourtSearch.destroy as jest.Mock).mockResolvedValueOnce(undefined);

      await candidateService.deleteCandidateById(1);

      // Verify all destroy methods were called
      expect(Report.destroy).toHaveBeenCalledWith({ where: { candidateId: 1 } });
      expect(CourtSearch.destroy).toHaveBeenCalledWith({ where: { candidateId: 1 } });
      expect(Candidate.findByPk).toHaveBeenCalledWith(1);
    });

    it("should throw error if deletion fails", async () => {
      // Mock candidate find
      (Candidate.findByPk as jest.Mock).mockResolvedValueOnce({
        ...mockCandidate,
        destroy: jest.fn().mockRejectedValueOnce(new Error(MESSAGES.ERROR.DELETE_CANDIDATE_FAILED))
      });

      try {
        await candidateService.deleteCandidateById(1);
      } catch (error: any) {
        expect(error).toBeInstanceOf(CustomError);
        expect(error.message).toBe(MESSAGES.ERROR.DELETE_CANDIDATE_FAILED);
        expect(error.status).toBe(STATUS_CODES.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe("getAllCandidates", () => {
    it("should return all candidates", async () => {
      const candidates = [mockCandidate];
      (Candidate.findAll as jest.Mock).mockResolvedValueOnce(candidates);

      const result = await candidateService.getAllCandidates();

      expect(result).toEqual(candidates);
    });

    it("should throw error if fetching candidates fails", async () => {
      (Candidate.findAll as jest.Mock).mockRejectedValueOnce(
        new Error("Fetch error")
      );

      try {
        await candidateService.getAllCandidates();
      } catch (error: any) {
        expect(error.message).toBe(MESSAGES.ERROR.FETCH_CANDIDATES_FAILED);
      }
    });
  });
});
