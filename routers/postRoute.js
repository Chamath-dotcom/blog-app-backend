import express from "express";
import multer from "multer";
import { addPost, likePost, addComment, sharePost, getPostById } from '../controllers/postController.js';

const postRoute = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg and .png images are allowed"), false);
    }
  }
});

postRoute.post("/add", upload.single('image'), addPost);
postRoute.post("/like/:id", likePost);
postRoute.post("/comment/:id", addComment);

// Share a post
postRoute.post("/share/:id", sharePost);

// Get a post by ID (for sharing)
postRoute.get("/:id", getPostById);

export default postRoute;