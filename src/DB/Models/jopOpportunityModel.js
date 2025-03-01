import mongoose from "mongoose";
import { location, role, workingTime } from "../../Utilities/Enums.js";

const jopOpportunitySchema = new mongoose.Schema(
  {
    jobTitle: String,
    jobLocation: {
      type: String,
      enum: Object.values(location),
    },
    workingTime: {
      type: String,
      enum: Object.values(workingTime),
    },
    seniorityLevel: {
      type: String,
      trim: true,
    },
    jobDescription: {
      type: String,
      trim: true,
    },
    technicalSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    softSkills: [{ type: String, trim: true }],
    addedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    closed: Boolean,
    companyId: {
      type: mongoose.Schema.ObjectId,
      ref: "company",
    },
  },
  {
    timestamps: true,
  }
);
jopOpportunitySchema.virtual("applications", {
  ref: "application",
  localField: "_id",
  foreignField: "jobId",
})
jopOpportunitySchema.pre("save", async function (next) {
  const HRS = await mongoose.model("user").findById(this.addedBy);

    if (!HRS) {
      return next(new Error("User not found"));
    }

    if (HRS.role !== role.HR) {
      return next(new Error("Only HR can add a job"));
    }
  next();
});
jopOpportunitySchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await mongoose
      .model("application")
      .updateMany({ parentId: this._id }, { isDeleted: true });
    next();
  }
);

const jopOpportunityModel =
  mongoose.model.jopOpportunity ||
  mongoose.model("jopOpportunity", jopOpportunitySchema);
export default jopOpportunityModel;
