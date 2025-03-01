import cron from "node-cron";
import userModel from "../DB/Models/userModel.js";

export const expiredOTPs = async () => {
  await userModel.updateMany(
    {},
    { $pull: { OTP: { expiresIn: { $lt: new Date() } } } }
  );
};

cron.schedule("0 */6 * * *", async () => {
  console.log(" Deleting expired OTPs...");
  await expiredOTPs();
});
