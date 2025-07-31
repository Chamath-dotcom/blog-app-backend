import Post from "../models/post.js";
import User from "../models/user.js"; // Import your User model

export async function addPost(req, res) {
  try {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    // Fetch user info
    const user = await User.findOne({ email: req.user.email });
    const authorName = user ? `${user.firstName} ${user.lastName}` : req.user.email;

    const newPost = new Post({
      title,
      content,
      author: authorName, // Save name instead of email
      image,
    });

    const response = await newPost.save();

    res.status(201).json({
      message: "Post added successfully",
      post: response,
    });
  } catch (e) {
    console.error("Error adding post:", e);
    res.status(500).json({
      message: "Failed to add post",
    });
  }
}

export async function likePost(req, res) {
  try {
    const postId = req.params.id;
    const userEmail = req.user.email;
    console.log(req.params);
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(userEmail);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(email => email !== userEmail);
    } else {
      // Like
      post.likes.push(userEmail);
    }

    await post.save();
    res.json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likes: post.likes.length,
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to like/unlike post" });
  }
}

export async function addComment(req, res) {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const author = req.user.email;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required." });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ author, text });
    await post.save();

    res.status(201).json({
      message: "Comment added successfully",
      comments: post.comments,
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to add comment" });
  }
}

export async function sharePost(req, res) {
  try {
    const postId = req.params.id;
    const userEmail = req.user.email;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Prevent duplicate shares by the same user
    if (!post.shares.includes(userEmail)) {
      post.shares.push(userEmail);
      await post.save();
    }

    // You can return a shareable link (frontend can use this)
    const shareUrl = `${req.protocol}://${req.get('host')}/api/post/${postId}`;

    res.json({
      message: "Post shared successfully",
      shareUrl,
      shares: post.shares.length,
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to share post" });
  }
}

// Fetch a post by ID (for sharing)
export async function getPostById(req, res) {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch post" });
  }
}

export async function getAllPosts(req, res) {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
}

export async function updatePost(req, res) {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;
    const user = await User.findOne({ email: req.user.email });
    const authorName = user ? `${user.firstName} ${user.lastName}` : req.user.email;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Allow author or admin to update
    if (post.author !== authorName && user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to update this post." });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    if (req.file) {
      post.image = req.file.filename;
    }
    await post.save();

    res.json({ message: "Post updated successfully", post });
  } catch (e) {
    res.status(500).json({ message: "Failed to update post" });
  }
}

export async function deletePost(req, res) {
  try {
    const postId = req.params.id;
    const user = await User.findOne({ email: req.user.email });
    const authorName = user ? `${user.firstName} ${user.lastName}` : req.user.email;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only author or admin can delete
    if (post.author !== authorName && user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to delete this post." });
    }

    await Post.findByIdAndDelete(postId);
    res.json({ message: "Post deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: "Failed to delete post" });
  }
}