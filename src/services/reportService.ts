import Report from "../models/reportModel";
import Candidate from "../models/candidateModel";
import { CustomError } from "../utils/errorUtil";
import { STATUS_CODES, MESSAGES } from "../utils/constants";

class ReportService {
  async createReport(candidateId: number, reportData: any) {
    const candidate = await Candidate.findByPk(candidateId);
    if (!candidate) {
      throw new CustomError(
        MESSAGES.ERROR.CANDIDATE_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }

    const existingReport = await Report.findOne({ where: { candidateId } });
    if (existingReport) {
      throw new CustomError(
        MESSAGES.ERROR.REPORT_ALREADY_EXISTS,
        STATUS_CODES.BAD_REQUEST
      );
    }

    const report = await Report.create({ ...reportData, candidateId });
    return report;
  }

  async getReportByCandidateId(candidateId: number) {
    const report = await Report.findOne({ where: { candidateId } });
    if (!report) {
      throw new CustomError(
        MESSAGES.ERROR.REPORT_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }
    return report;
  }

  async updateReport(reportId: number, reportData: any) {
    const report = await Report.findByPk(reportId);
    if (!report) {
      throw new CustomError(
        MESSAGES.ERROR.REPORT_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }
    await report.update(reportData);
    return report;
  }

  async deleteReport(reportId: number) {
    const report = await Report.findByPk(reportId);
    if (!report) {
      throw new CustomError(
        MESSAGES.ERROR.REPORT_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }
    await report.destroy();
  }

  async getReportById(reportId: number) {
    const report = await Report.findByPk(reportId);
    if (!report) {
      throw new CustomError(
        MESSAGES.ERROR.REPORT_NOT_FOUND,
        STATUS_CODES.NOT_FOUND
      );
    }
    return report;
  }
}

export default new ReportService();
