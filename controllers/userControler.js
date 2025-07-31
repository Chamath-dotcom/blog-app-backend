import bcrypt from 'bcrypt'; 
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import dotenv  from 'dotenv';

dotenv.config();

export async function registerUser(req,res){
  const userData =req.body;
  if (req.file) {
    userData.profilePicture = req.file.filename;
  }
  const salt =bcrypt.genSaltSync(10);
  userData.password= bcrypt.hashSync(userData.password,salt);
  const newUser =new User(userData);
  try{
    await newUser.save();
    res.json({message :`${userData.firstName} registered`})
  }catch{
    res.status(500).json({error :"User already registered"})
  }
  
}
export function loginUser(req,res){
    const userData =req.body;
    console.log( userData);
    User.findOne({email: userData.email})
    .then((user)=>{
        if(user ==null)
        {   
        res.status(404).json({error :"user not found"});
        }else
        {
        const isCorrectPassword =bcrypt.compareSync(userData.password,user.password)
        if(isCorrectPassword){
            const token =jwt.sign({
                firstName:user.firstName,
                lastName:user.lastName,
                email:user.email,
                role:user.role,
                profilePicture:user.profilePicture,
                phone:user.phone
            },process.env.SECRET_KEY)
            res.json({message :`${user.firstName} loged`,token :token,user :user})
        }else
        {
        res.status(401).json({error :"incorrect password"});
        }
        }
        
    })
}

export async function getAllUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

export async function updateUser(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const updateData = req.body;
    if (req.file) {
      updateData.profilePicture = req.file.filename;
    }
    const user = await User.findOneAndUpdate(
      { email: decoded.email },
      updateData,
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fix: Always send full URL for profilePicture
    const userObj = user.toObject();
    if (userObj.profilePicture && !userObj.profilePicture.startsWith("http")) {
      userObj.profilePicture = `${process.env.BACKEND_URL || "http://localhost:5173"}/uploads/${userObj.profilePicture}`;
    }
    res.json(userObj);
  } catch (e) {
    res.status(500).json({ message: "Failed to update user" });
  }
}

export function isItAdmin(req){
  const user =req.user;
  let isAdmin =false;
  if(user !== null && user.role=="admin"){
      isAdmin=true
  }
  return isAdmin;
}
export function isItCustomer(req){
  const user = req.user;
  let isCostermer = false;
  if(user !==null && user.role=="user"){
    isCostermer=true
  }
  return isCostermer;
}

export async function getUserByAuthor(req, res) {
  const { author } = req.query;
  if (!author) return res.status(400).json({ message: "No author provided" });
  const user = await User.findOne({
    $expr: {
      $eq: [
        { $concat: ["$firstName", " ", "$lastName"] },
        author
      ]
    }
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
}

export async function followUser(req, res) {
  const { author } = req.body; // author to follow
  const followerEmail = req.user.email;
  if (!author) return res.status(400).json({ message: "No author provided" });

  // Find the user to follow
  const userToFollow = await User.findOne({ 
    $expr: { $eq: [ { $concat: [ "$firstName", " ", "$lastName" ] }, author ] }
  });
  if (!userToFollow) return res.status(404).json({ message: "User not found" });

  // Find the follower
  const follower = await User.findOne({ email: followerEmail });
  if (!follower) return res.status(404).json({ message: "Follower not found" });

  // Prevent self-follow
  if (userToFollow.email === followerEmail) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  // Add follower/following if not already
  if (!userToFollow.followers.includes(followerEmail)) {
    userToFollow.followers.push(followerEmail);
    await userToFollow.save();
  }
  const authorName = `${userToFollow.firstName} ${userToFollow.lastName}`;
  if (!follower.following.includes(authorName)) {
    follower.following.push(authorName);
    await follower.save();
  }

  res.json({ message: "Followed", followers: userToFollow.followers, following: follower.following });
}

export async function unfollowUser(req, res) {
  const { author } = req.body;
  const followerEmail = req.user.email;
  if (!author) return res.status(400).json({ message: "No author provided" });

  const userToUnfollow = await User.findOne({ 
    $expr: { $eq: [ { $concat: [ "$firstName", " ", "$lastName" ] }, author ] }
  });
  if (!userToUnfollow) return res.status(404).json({ message: "User not found" });

  const follower = await User.findOne({ email: followerEmail });
  if (!follower) return res.status(404).json({ message: "Follower not found" });

  userToUnfollow.followers = userToUnfollow.followers.filter(e => e !== followerEmail);
  await userToUnfollow.save();

  follower.following = follower.following.filter(a => a !== author);
  await follower.save();

  res.json({ message: "Unfollowed", followers: userToUnfollow.followers, following: follower.following });
}

export async function getMe(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user }); // <-- Make sure this returns the full user object, including following!
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
}