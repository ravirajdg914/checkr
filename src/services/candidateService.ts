import Candidate from "../models/candidateModel";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import { CustomError } from "../utils/errorUtil";

class CandidateService {
  async createCandidate(data: {
    name: string;
    email: string;
    dob: Date;
    phone: string;
    zipcode: string;
    social_security: string;
    drivers_license: string;
  }) {
    const existingCandidate = await Candidate.findOne({
      where: { email: data.email },
    });

    if (existingCandidate) {
      throw new CustomError(MESSAGES.ERROR.EMAIL_TAKEN, STATUS_CODES.BAD_REQUEST);
    }

    const candidate = await Candidate.create(data);
    return candidate;
  }

  async getCandidateById(id: number) {
    const candidate = await Candidate.findByPk(id);

    if (!candidate) {
      throw new CustomError(MESSAGES.ERROR.CANDIDATE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    return candidate;
  }

  async getAllCandidates() {
    try {
      const candidates = await Candidate.findAll({
        attributes: ["name", "adjudication", "status", "location", "date"],
      });
      return candidates;
    } catch (error: any) {
      throw new Error(MESSAGES.ERROR.FETCH_CANDIDATES_FAILED);
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
        throw new Error(MESSAGES.ERROR.CANDIDATE_NOT_FOUND);
      }

      await candidate.destroy();
    } catch (error: any) {
      throw new Error(error.message || MESSAGES.ERROR.DELETE_CANDIDATE_FAILED);
    }
  }
}

export default new CandidateService();
