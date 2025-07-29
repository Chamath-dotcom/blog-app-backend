import Post from "../models/post.js";

export async function addPost(req, res) {
  try {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    const newPost = new Post({
      title,
      content,
      author: req.user.email,
      image, // Save image filename
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