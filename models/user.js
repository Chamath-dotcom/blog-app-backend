import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: 'user'
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type:String,
        requied:true
    },
    address:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    profilePicture : {
      type : String,
      required : true,
      default : "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
    },
    followers: [{ type: String, default: [] }], // store emails or author names
    following: [{ type: String, default: [] }]
})

const User =mongoose.model('user',userSchema);

export default User;