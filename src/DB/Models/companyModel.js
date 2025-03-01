import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    address: {
      street: String,
      city: String,
    },
    numberOfEmployees: {
      type: String,
      validate: {
        validator: function (value) {
          return /^\d+-\d+$/.test(value);
        },
      },
    },
    companyEmail: {
      type: String,
      unique: true,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    deletedAt: Date,
    bannedAt: Date,
    changeCredentialTime: Date,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    Logo: {
      secure_url: String,
      public_id: String,
    },
    coverPic: {
      secure_url: String,
      public_id: String,
    },
    HRs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    legalAttachment: {
      secure_url: String,
      public_id: String,
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
companySchema.virtual("jobs", {
  ref: "jobOpportunity",
  localField: "_id",
  foreignField: "companyId",
});

companySchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await mongoose
      .model("jopOpportunity")
      .updateMany({ parentId: this._id }, { isDeleted: true });
    next();
  }
);

companySchema.pre("findOneAndDelete", async function (next) {
  const companyId = this.getQuery()._id;
  await mongoose
    .model("jopOpportunity")
    .updateMany({ parentId: companyId }, { isDeleted: true });
  next();
});

const companyModel =
  mongoose.models.company || mongoose.model("company", companySchema);

export default companyModel;
