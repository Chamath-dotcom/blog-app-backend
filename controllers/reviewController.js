import Review from "../models/review.js";

export function addReview(req, res) {
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

    newReview.save()
       .then(() => {
            res.json({ message: "Review added successfully!" });
        })
       .catch(() => {
            res.status(500).json({ error: "Failed to add review" });
        });

    
}

export function getReviews(req, res) {
    const user = req.user;

    if (user==null ||user.role !=="admin"){
        Review.findOne({isApproved : true}).then((reviews)=>{
            res.json(reviews);
            return;
        })
    }else{
        Review.find().then((reviews)=>{
            res.json(reviews);
            return;
        })
    }
}
export function deleteReview(req, res) {
    const user = req.user;
    const email = req.params.email;
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