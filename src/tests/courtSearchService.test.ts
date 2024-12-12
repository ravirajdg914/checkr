import courtSearchService from "../services/courtSearchService";
import CourtSearch from "../models/courtSearchModel";
import Candidate from "../models/candidateModel";
import { CustomError } from "../utils/errorUtil";
import { MESSAGES, STATUS_CODES } from "../utils/constants";

// Mocking Sequelize Model Methods
jest.mock("../models/courtSearchModel", () => ({
  findByPk: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
}));

jest.mock("../models/candidateModel", () => ({
  findByPk: jest.fn(),
}));

describe("CourtSearchService", () => {
  const mockCandidateId = 1;
  const mockCourtSearchId = 1;
  const mockCourtSearchData = {
    status: "clear",
    search_type: "criminal",
    date: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCourtSearch", () => {
    it("should throw error if candidate is not found", async () => {
      (Candidate.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        courtSearchService.createCourtSearch(mockCandidateId, mockCourtSearchData)
      ).rejects.toEqual(
        new CustomError(
          MESSAGES.ERROR.CANDIDATE_NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        )
      );
    });

    it("should create a court search successfully", async () => {
      (Candidate.findByPk as jest.Mock).mockResolvedValueOnce({});
      (CourtSearch.create as jest.Mock).mockResolvedValueOnce(mockCourtSearchData);

      const courtSearch = await courtSearchService.createCourtSearch(
        mockCandidateId,
        mockCourtSearchData
      );

      expect(courtSearch).toEqual(mockCourtSearchData);
    });
  });

  describe("getCourtSearchesByCandidateId", () => {
    it("should return all court searches for a candidate", async () => {
      const courtSearches = [mockCourtSearchData];
      (CourtSearch.findAll as jest.Mock).mockResolvedValueOnce(courtSearches);

      const result = await courtSearchService.getCourtSearchesByCandidateId(mockCandidateId);

      expect(result).toEqual(courtSearches);
      expect(CourtSearch.findAll).toHaveBeenCalledWith({
        where: { candidateId: mockCandidateId }
      });
    });
  });

  describe("getCourtSearchById", () => {
    it("should throw error if court search is not found", async () => {
      (CourtSearch.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        courtSearchService.getCourtSearchById(mockCourtSearchId)
      ).rejects.toEqual(
        new CustomError(
          MESSAGES.ERROR.COURT_SEARCH_NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        )
      );
    });

    it("should retrieve a court search successfully", async () => {
      (CourtSearch.findByPk as jest.Mock).mockResolvedValueOnce(mockCourtSearchData);

      const courtSearch = await courtSearchService.getCourtSearchById(mockCourtSearchId);

      expect(courtSearch).toEqual(mockCourtSearchData);
      expect(CourtSearch.findByPk).toHaveBeenCalledWith(mockCourtSearchId);
    });
  });

  describe("updateCourtSearchStatus", () => {
    it("should throw error if court search is not found", async () => {
      (CourtSearch.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        courtSearchService.updateCourtSearchStatus(mockCourtSearchId, "consider")
      ).rejects.toEqual(
        new CustomError(
          MESSAGES.ERROR.COURT_SEARCH_NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        )
      );
    });

    it("should update court search status successfully", async () => {
      const mockCourtSearch = {
        ...mockCourtSearchData,
        status: "clear",
        save: jest.fn().mockResolvedValueOnce({ ...mockCourtSearchData, status: "consider" }),
      };
      (CourtSearch.findByPk as jest.Mock).mockResolvedValueOnce(mockCourtSearch);

      const updatedCourtSearch = await courtSearchService.updateCourtSearchStatus(
        mockCourtSearchId,
        "consider"
      );

      expect(updatedCourtSearch.status).toBe("consider");
      expect(mockCourtSearch.save).toHaveBeenCalled();
    });
  });

  describe("deleteCourtSearch", () => {
    it("should throw error if court search is not found", async () => {
      (CourtSearch.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        courtSearchService.deleteCourtSearch(mockCourtSearchId)
      ).rejects.toEqual(
        new CustomError(
          MESSAGES.ERROR.COURT_SEARCH_NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        )
      );
    });

    it("should delete a court search successfully", async () => {
      const mockCourtSearch = { destroy: jest.fn().mockResolvedValueOnce(null) };
      (CourtSearch.findByPk as jest.Mock).mockResolvedValueOnce(mockCourtSearch);

      await courtSearchService.deleteCourtSearch(mockCourtSearchId);

      expect(mockCourtSearch.destroy).toHaveBeenCalled();
    });
  });
}); 