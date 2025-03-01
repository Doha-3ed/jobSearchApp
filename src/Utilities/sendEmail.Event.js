import { EventEmitter } from "events";
import { nanoid, customAlphabet } from "nanoid";
import { hash } from "../Utilities/Encryption/index.js";
import userModel from "../DB/Models/userModel.js";
import { OTPtypes } from "../Utilities/Enums.js";
import { sendEmail } from "../modules/User/Service/sendEmail.js";
import { html } from "../modules/User/Service/html.js";
export const eventemit = new EventEmitter();
eventemit.on("sendEmail", async (data) => {
  const { email } = data;
  const otp = customAlphabet("0123456789", 4)();
  const hashing = await hash({ key: otp, SALT_ROUND: process.env.SALT_ROUND });
  await userModel.updateOne(
    { email },
    {
      $push: {
        OTP: {
          code: hashing,
          type: OTPtypes.cEmail,
          expiresIn: new Date(Date.now() + 10 * 60 * 1000), // Expires in 10 min
        },
      },
    }
  );

  await sendEmail(email, "Confirm me", html({ otp, type: "Confirm Email" }));
});

eventemit.on("forgetPassword", async (data) => {
  const { email } = data;
  const otp = customAlphabet("0123456789", 4)();
  const hashing = await hash({ key: otp, SALT_ROUND: process.env.SALT_ROUND });
  await userModel.updateOne(
    { email },
    {
      $push: {
        OTP: {
          code: hashing,
          type: OTPtypes.forgetPassword,
          expiresIn: new Date(Date.now() + 10 * 60 * 1000), // Expires in 10 min
        },
      },
    }
  );

  await sendEmail(
    email,
    "forget Password",
    html({ otp, type: "forget Password" })
  );
});
eventemit.on("applicationStatus", async ({ email, result }) => {
  await sendEmail(email, "Job Application Update", result);
});
