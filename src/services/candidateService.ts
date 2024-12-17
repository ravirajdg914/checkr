import Candidate from "../models/candidateModel";
import {
  STATUS_CODES,
  MESSAGES,
  CANDIDATE_ATTRIBUTES,
  REPORT_ATTRIBUTES,
  COURT_SEARCH_ATTRIBUTES,
} from "../utils/constants";
import { CustomError } from "../utils/errorUtil";
import Report from "../models/reportModel";
import CourtSearch from "../models/courtSearchModel";
import PreAdverseAction from "../models/preAdverseActionModel";

class CandidateService {
  async createCandidate(data: any) {
    const existingCandidate = await Candidate.findOne({
      where: { email: data.email },
    });

    if (existingCandidate) {
      throw new CustomError(
        MESSAGES.ERROR.EMAIL_TAKEN,
        STATUS_CODES.BAD_REQUEST
      );
    }

    const candidate = await Candidate.create(data);
    return candidate;
  }

  async getCandidateById(id: number) {
    const candidate = await Candidate.findByPk(id, {
      include: [
        {
          model: Report,
          attributes: REPORT_ATTRIBUTES,
        },
        {
          model: CourtSearch,
          attributes: COURT_SEARCH_ATTRIBUTES,
        },
      ],
    });

    if (!candidate) {
      throw new CustomError(
        MESSAGES.ERROR.CANDIDATE_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }

    return candidate;
  }

  async getAllCandidates() {
    try {
      const candidates = await Candidate.findAll({
        attributes: CANDIDATE_ATTRIBUTES,
      });
      return candidates;
    } catch (error: any) {
      throw new CustomError(
        MESSAGES.ERROR.FETCH_CANDIDATES_FAILED,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateCandidateById(id: number, updatedData: any) {
    try {
      const candidate = await Candidate.findByPk(id);
      if (!candidate) {
        throw new Error(MESSAGES.ERROR.CANDIDATE_NOT_FOUND);
      }

      await candidate.update(updatedData);
      return candidate;
    } catch (error: any) {
      throw new Error(error.message || MESSAGES.ERROR.UPDATE_CANDIDATE_FAILED);
    }
  }

  async deleteCandidateById(id: number): Promise<void> {
    try {
      const candidate = await Candidate.findByPk(id);
      if (!candidate) {
        throw new CustomError(
          MESSAGES.ERROR.CANDIDATE_NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        );
      }

      // Delete associated records first
      await Report.destroy({ where: { candidateId: id } });
      await CourtSearch.destroy({ where: { candidateId: id } });

      // Then delete the candidate
      await candidate.destroy();
    } catch (error: any) {
      throw new CustomError(
        error.message || MESSAGES.ERROR.DELETE_CANDIDATE_FAILED,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async handlePreAdverseActionUpdate(candidateId: number) {
    const preAdverseActions = await PreAdverseAction.findAll({
      where: { candidateId },
    });

    const hasAdverseAction = preAdverseActions.some((action) =>
      action.charges.some((charge: any) => charge.status === true)
    );

    if (hasAdverseAction) {
      const candidate = await Candidate.findByPk(candidateId);
      if (candidate) {
        await candidate.update({ adjudication: "adverse action" });
      }
    }
  }
}

export default new CandidateService();
