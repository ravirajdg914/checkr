// Mock the courtSearchService before importing the controller
jest.mock("../services/courtSearchService", () => ({
    createCourtSearch: jest.fn(),
    getCourtSearchesByCandidateId: jest.fn(),
    getCourtSearchById: jest.fn(),
    updateCourtSearchStatus: jest.fn(),
    deleteCourtSearch: jest.fn(),
  }));
  
  // Import the controller functions and dependencies
  import {
    createCourtSearch,
    getAllCourtSearchesByCandidateId,
    getCourtSearchById,
    updateCourtSearchStatus,
    deleteCourtSearch,
  } from "../controllers/courtSearchController";
  import { Request, Response } from "express";
  import courtSearchService from "../services/courtSearchService";
  import { STATUS_CODES } from "../utils/constants";
  
  describe("CourtSearchController", () => {
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
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe("createCourtSearch", () => {
      it("should create a court search and return 201 status", async () => {
        const req = mockRequest(
          { status: "clear", search_type: "criminal", date: new Date() },
          { candidateId: "1" }
        );
        const res = mockResponse();
        const courtSearch = { id: 1, ...req.body, candidateId: 1 };
  
        (courtSearchService.createCourtSearch as jest.Mock).mockResolvedValueOnce(courtSearch);
  
        await createCourtSearch(req, res, jest.fn());
  
        expect(courtSearchService.createCourtSearch).toHaveBeenCalledWith(1, req.body);
        expect(res.status).toHaveBeenCalledWith(STATUS_CODES.CREATED);
        expect(res.json).toHaveBeenCalledWith(courtSearch);
      });
    });
  
    describe("getAllCourtSearchesByCandidateId", () => {
      it("should return all court searches for a candidate", async () => {
        const req = mockRequest({}, { candidateId: "1" });
        const res = mockResponse();
        const courtSearches = [
          { id: 1, candidateId: 1, status: "clear" },
          { id: 2, candidateId: 1, status: "consider" },
        ];
  
        (courtSearchService.getCourtSearchesByCandidateId as jest.Mock).mockResolvedValueOnce(courtSearches);
  
        await getAllCourtSearchesByCandidateId(req, res, jest.fn());
  
        expect(courtSearchService.getCourtSearchesByCandidateId).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS);
        expect(res.json).toHaveBeenCalledWith(courtSearches);
      });
    });
  
    describe("getCourtSearchById", () => {
      it("should return a court search by ID", async () => {
        const req = mockRequest({}, { id: "1" });
        const res = mockResponse();
        const courtSearch = { id: 1, status: "clear" };
  
        (courtSearchService.getCourtSearchById as jest.Mock).mockResolvedValueOnce(courtSearch);
  
        await getCourtSearchById(req, res, jest.fn());
  
        expect(courtSearchService.getCourtSearchById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS);
        expect(res.json).toHaveBeenCalledWith(courtSearch);
      });
    });
  
    describe("updateCourtSearchStatus", () => {
      it("should update court search status", async () => {
        const req = mockRequest({ status: "consider" }, { id: "1" });
        const res = mockResponse();
        const updatedCourtSearch = { id: 1, status: "consider" };
  
        (courtSearchService.updateCourtSearchStatus as jest.Mock).mockResolvedValueOnce(updatedCourtSearch);
  
        await updateCourtSearchStatus(req, res, jest.fn());
  
        expect(courtSearchService.updateCourtSearchStatus).toHaveBeenCalledWith(1, "consider");
        expect(res.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS);
        expect(res.json).toHaveBeenCalledWith(updatedCourtSearch);
      });
    });
  
    describe("deleteCourtSearch", () => {
      it("should delete a court search", async () => {
        const req = mockRequest({}, { id: "1" });
        const res = mockResponse();
  
        await deleteCourtSearch(req, res, jest.fn());
  
        expect(courtSearchService.deleteCourtSearch).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(STATUS_CODES.SUCCESS);
        expect(res.json).toHaveBeenCalledWith({
          message: "Court search deleted successfully.",
        });
      });
    });
  });
  