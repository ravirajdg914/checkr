import Candidate from "./candidateModel";
import Report from "./reportModel";
import CourtSearch from "./courtSearchModel";

Candidate.hasOne(Report, {
  foreignKey: "candidateId",
  onDelete: "CASCADE",
});

Report.belongsTo(Candidate, {
  foreignKey: "candidateId",
  onDelete: "CASCADE",
});

Candidate.hasMany(CourtSearch, {
  foreignKey: "candidateId",
  onDelete: "CASCADE",
});

CourtSearch.belongsTo(Candidate, {
  foreignKey: "candidateId",
  onDelete: "CASCADE",
});
