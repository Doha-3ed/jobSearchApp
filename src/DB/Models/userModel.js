import mongoose from "mongoose";
import { decrypt, encrypt, hash } from "../../Utilities/Encryption/index.js";
import { gender, OTPtypes, provider, role } from "../../Utilities/Enums.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required:  function () { return this.provider === provider.system; },
    },
    provider: {
      type: String,
      enum: Object.values(provider),
      default: provider.system,
    },
    gender: {
      type: String,
      enum: Object.values(gender),
    },
    DOB: {
      type: Date,

      validatee: {
        validatee: function (value) {
          const age = new Date().getFullYear() - value.getFullYear();
          return age >= 18;
        },
        message: "Date of birth cannot be in the future.",
      },
    },
    mobileNumber: String,
    role: {
      type: String,
      enum: Object.values(role),
    },
    isConfirmed: {type:Boolean,
      default:false
    },
    deletedAt: Date,
    bannedAt: Date,
    changeCredentialTime: Date,
    updatedBy: { type: String, ref: "user" },
    profilePic: {
      secure_url: String,
      public_id: String,
    },
    coverPic: {
      secure_url: String,
      public_id: String,
    },
    OTP: [
      {
        code: { type: String, required: true },
        type: { type: String, enum: Object.values(OTPtypes), required: true },
        expiresIn: { type: Date },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);
userSchema
  .virtual("userName")
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (v) {
    this.firstName = v.substr(0, v.indexOf(" "));
    this.lastName = v.substr(v.indexOf(" ") + 1);
  });
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash({
      key: this.password,
      SALT_ROUND: process.env.SALT_ROUND,
    });
  }

  if (this.isModified("phone")) {
    this.phone = await encrypt({
      key: this.phone,
      SECRETE_KEY: process.env.SECRETE_KEY,
    });
  }

  next();
});
userSchema.post("findById", function (data) {
  if (data?.mobileNumber) {
    data.mobileNumber = decrypt({
      key: data.mobileNumber,
      SECRETE_KEY: process.env.SECRETE_KEY,
    });
  }
});

userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await mongoose
      .model("chat")
      .updateMany({ parentId: this._id }, { isDeleted: true });
    next();
  }
);
const userModel = mongoose.model.user || mongoose.model("user", userSchema);
export default userModel;
