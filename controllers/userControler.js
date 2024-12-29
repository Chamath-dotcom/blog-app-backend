import bcrypt from 'bcrypt'; 
import User from '../models/user.js';

export function registerUser(req,res){
  const userData =req.body;
  const salt =bcrypt.genSaltSync(10);
  userData.password= bcrypt.hashSync(userData.password,salt);
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
            res.json({message :`${user.firstName} loged`})
        }else
        {
        res.json({error :"incorrect password"});
        }
        }
        
    })
}