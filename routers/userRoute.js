import express from "express";
import { loginUser, registerUser, getAllUsers, updateUser } from '../controllers/userControler.js'
import multer from "multer";

const userRoute = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

userRoute.post("/register", upload.single("profilePicture"), registerUser);
userRoute.post("/login", loginUser);
userRoute.get("/", getAllUsers);
userRoute.put("/update", upload.single("profilePicture"), updateUser);

export default userRoute;