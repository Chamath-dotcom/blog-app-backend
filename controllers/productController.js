import Product from "../models/product.js";
import { isItAdmin } from "./userControler.js";


export async function addProduct(req,res){
    console.log(req.user);
    const user = req.user;
    const productData = req.body;
    const newProduct = new Product(productData)
    if(user == null || user.role !=="admin")
        {
            res.status(401).json({message:"you can't access this"});
            return
        }
    try{
        await newProduct.save();
            res.json({message :`${productData.name} added !`})
        
    }
    catch{
        res.json({message:"product addition failed !"});
    }

}

export async function getProduct(req,res){
    const user =req.user;;
    try{
        if( isItAdmin(req)){
         const foundProd = await Product.find();
         res.json({message:foundProd})            
        }else{
         const foundProd = await Product.find({availability:true});
         res.json({message:foundProd})
        }
    }catch{
        res.json({message :"something went wrong!!"})
    }

}

export async function deleteProduct(req,res) {
    
    try{
        if(isItAdmin(req) ){
        const prod_key = req.params.prod_key;
        
        const result = await Product.deleteOne({prod_key:prod_key});

        if (result.deletedCount === 0) {

            res.status(404).json({ message: "Product not found or already deleted" });
            return;
          }

          console.log(`${prod_key} is deleted`);
          res.json({ message: "Product deleted successfully" });

        } else {

          res.status(403).json({ message: "You are not authorized to delete this product" });
          return;

        }
    }
    catch(err){
        res.status(500).json({message:"Failed to delete Product",err})
    }
    
    
}

export async function updateProduct(req,res){
    try{
      if(isItAdmin(req)){
        const prod_key= req.params.prod_key;
        const data = req.body
  
        await Product.updateOne({prod_key:prod_key},data)
  
        res.json({
          message : "Product updated successfully"
        })
        return;
  
      }else{
        res.status(403).json({
          message : "You are not authorized to perform this action"
        })
        return;
      }
  
    }catch(e){
      res.status(500).json({
        message : "Failed to update product"
      })
    }
  }


