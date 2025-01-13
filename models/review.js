import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    email :{
        type: String,
        required: true,
        unique: true
    },
    name :{
        type: String,
        required: true
    },
    review:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        required: true,
        default: Date.now
    }
})

const Review =mongoose.model('review',reviewSchema);
export default Review;