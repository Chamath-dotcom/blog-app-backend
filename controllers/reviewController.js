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