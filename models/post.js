import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String },
    likes: [{ type: String }],
    comments: [commentSchema],
    shares: [{ type: String }], // Array of user emails or IDs who shared
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;