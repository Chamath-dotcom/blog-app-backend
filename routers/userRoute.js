import express from "express";
import { loginUser, registerUser, getAllUsers, updateUser, getUserByAuthor, followUser, unfollowUser, getMe } from '../controllers/userControler.js'
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
userRoute.post("/follow", followUser);
userRoute.post("/unfollow", unfollowUser);
userRoute.get("/me", getMe);

export default userRoute;