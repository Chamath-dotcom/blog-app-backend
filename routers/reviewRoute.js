import express from 'express';
import { addReview, approveReview, deleteReview, getReviews } from '../controllers/reviewController.js';

const reviewRouter = express.Router();
reviewRouter.post('/addReview',addReview);
reviewRouter.get('/getReviews',getReviews);
reviewRouter.delete('/deleteReview/:email',deleteReview);
reviewRouter.put('/approveReview/:email',approveReview);
export default reviewRouter;