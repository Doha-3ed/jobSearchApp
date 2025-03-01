import Router from "express";
import { validation } from "../../middleWare/Validation.js";

import { fileTypes, multerHost } from "../../middleWare/multer.js";

import {
  authentication,
  authorization,
} from "../../middleWare/Authentication.js";
import { role } from "../../Utilities/Enums.js";
import * as CS from "./company.service.js";
import * as CV from "./company.validation.js";
import { approveCompany } from "../User/admainDashboard/admain.service.js";

const companyRouter = Router();

companyRouter.post(
  "/",
  multerHost(fileTypes.image).fields([
    { name: "coverPic", maxCount: 1 },
    { name: "Logo", maxCount: 1 },
  ]),
  validation(CV.addCompanySchema),
  CS.addCompany
);
companyRouter.patch(
  "/updateCompany/:companyId",
  multerHost(fileTypes.image).single("companyPic"),
  validation(CV.updateCompanySchema),
  authentication,
  CS.updateCompanyData
);
companyRouter.delete(
  "/softDelete/:companyId",

  validation(CV.softDeleteSchema),
  authentication,
  authorization([role.admin, role.user]),

  CS.softDelete
);
companyRouter.patch(
  "/uploadLogo/:companyId",
  multerHost(fileTypes.image).single("Logo"),
  authentication,
  authorization([role.admin, role.user]),
  validation(CV.uploadPicSchema),
  CS.uploadLogo
);
companyRouter.patch(
  "/uploadCover/:companyId",
  multerHost(fileTypes.image).single("Cover"),
  authentication,
  authorization([role.admin, role.user]),
  validation(CV.uploadPicSchema),
  CS.uploadCoverPic
);

companyRouter.delete(
  "/deleteLogo/:companyId",
  authentication,
  authorization([role.admin, role.user]),
  validation(CV.deletePicSchema),
  CS.deleteLogo
);
companyRouter.delete(
  "/deleteCover/:companyId",
  authentication,
  authorization([role.admin, role.user]),
  validation(CV.deletePicSchema),
  CS.deleteCoverPic
);
companyRouter.get(
  "/getCompanyWithJob/:companyId",
  validation(CV.getCompanyWithJobSchema),
  CS.getCompanyWithJobs
);
companyRouter.get(
  "/searchCompanyByName/:companyName",
  validation(CV.searchCompanySchema),
  CS.searchCompanyName
);
companyRouter.patch(
  "/approvebyAdmin/:companyId/:userId",
  validation(CV.approvedByAdminSchema),
  approveCompany
);
export default companyRouter;
