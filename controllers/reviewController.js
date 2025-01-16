import Review from "../models/review.js";

export async function addReview(req, res) {
    console.log(req.user);
    if (req.user == null) {
        res.status(401).json({ message: "Please login and try again!" });
        return;
    }
    const reviewData = req.body;

    reviewData.name = req.user.firstName + " " + req.user.lastName;
    reviewData.profilePicture = req.user.profilePicture;
    reviewData.email = req.user.email;

    const newReview = new Review(reviewData);

    try{
        await newReview.save();
        res.json({ message: "Review added successfully!" });
    }catch(err){
         res.status(500).json({ error: "Failed to add review" });
    }

    

    
}

export async function getReviews(req, res) {
    const user = req.user;
    try {
        if (user == null || user.role !== "admin") {
            const reviews = await Review.findOne({ isApproved: true });
            res.json(reviews);
        } else {
            const reviews = await Review.find();
            res.json(reviews);
        }
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching reviews." });
    }
}

export function deleteReview(req, res) {
    const user = req.user;
    const email = req.params.email;
    if (user==null ){
        res.status(401).json({ message: "Please login and try again!" });
        return;
    }
    if( user.role =="admin" || user.email==email){
    Review.deleteOne({email:email})
    .then((review)=>{
        res.json({message:"your review has been deleted"})
    })
    .catch((err)=>{
        res.json({message:"review deletion failed!",err})
    })
    }else{
        res.status(403).json({message:"You are not authorized to delete this review"})
    }
}

export function approveReview(req, res) {
    const email =req.params.email;
    const user =req.user;
    if(user==null){
        res.status(401).json({ message: "Please login and try again!" });
        return;
    }
    if( user.role =="admin"){
        Review.updateOne({email:email},{isApproved:true})
       .then(()=>{
        res.json({message:"review has been approved"})
       })
       .catch((err)=>{
        res.json({message:"review approval failed!",err})
       })
    }

}