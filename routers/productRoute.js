import express from 'express';
import addProduct from '../controllers/productController.js';

const productRoute =express.Router();

productRoute.post("/addProduct",addProduct);
export default  productRoute;