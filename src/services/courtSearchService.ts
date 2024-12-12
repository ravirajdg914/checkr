import CourtSearch from "../models/courtSearchModel";
import Candidate from "../models/candidateModel";
import { CustomError } from "../utils/errorUtil";
import { STATUS_CODES, MESSAGES } from "../utils/constants";

class CourtSearchService {
  async createCourtSearch(candidateId: number, searchData: any) {
    const candidate = await Candidate.findByPk(candidateId);
    if (!candidate) {
      throw new CustomError(
        MESSAGES.ERROR.CANDIDATE_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }

    const courtSearch = await CourtSearch.create({ ...searchData, candidateId });
    return courtSearch;
  }

  async getCourtSearchesByCandidateId(candidateId: number) {
    const courtSearches = await CourtSearch.findAll({ where: { candidateId } });
    return courtSearches;
  }

  async getCourtSearchById(courtSearchId: number) {
    const courtSearch = await CourtSearch.findByPk(courtSearchId);

    if (!courtSearch) {
      throw new CustomError(
        MESSAGES.ERROR.COURT_SEARCH_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }

    return courtSearch;
  }

  async updateCourtSearchStatus(courtSearchId: number, status: "clear" | "consider") {
    const courtSearch = await CourtSearch.findByPk(courtSearchId);

    if (!courtSearch) {
      throw new CustomError(
        MESSAGES.ERROR.COURT_SEARCH_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }

    courtSearch.status = status;
    await courtSearch.save();

    return courtSearch;
  }

  async deleteCourtSearch(courtSearchId: number) {
    const courtSearch = await CourtSearch.findByPk(courtSearchId);

    if (!courtSearch) {
      throw new CustomError(
        MESSAGES.ERROR.COURT_SEARCH_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }

    await courtSearch.destroy();
  }
}

export default new CourtSearchService(); 