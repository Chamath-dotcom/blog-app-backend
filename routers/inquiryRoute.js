import express from "express";
import { addInquiry, deleteInquiry, getInquiries, updateInquiry } from "../controllers/inquiryController.js";


const inquiryRoute = express.Router();

inquiryRoute.post("/addInquiry",addInquiry);
inquiryRoute.get("/getInquiries",getInquiries);
inquiryRoute.delete("/deleteInquiry",deleteInquiry);
inquiryRoute.put("/updateInquiry",updateInquiry);

export default inquiryRoute;