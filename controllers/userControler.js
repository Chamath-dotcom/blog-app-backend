import bcrypt from 'bcrypt'; 
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import dotenv  from 'dotenv';

dotenv.config();

export async function registerUser(req,res){
  const userData =req.body;
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
                profilePicture:user.profilePicture
            },process.env.SECRET_KEY)
            res.json({message :`${user.firstName} loged`,token :token})
        }else
        {
        res.json({error :"incorrect password"});
        }
        }
        
    })
}