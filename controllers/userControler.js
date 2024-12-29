import bcrypt from 'bcrypt'; 
import User from '../models/user.js';

export function registerUser(req,res){
  const userData =req.body;
  userData.password= bcrypt.hashSync(userData.password);
  const newUser =new User(userData);
  newUser.save().then(
    ()=>{
        res.json({message :`${userData.firstName} registered`})
    }
  ).catch(
    ()=>{
        res.status(500).json({error :"User registetion faild"})    
    }
  )
}